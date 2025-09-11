import cloudinary from "#/cloud";
import { RequestWithFiles } from "#/middleware/fielParser";
import { categoriesTypes } from "#/utils/audioCategory";
import { RequestHandler } from "express";
import formidable from "formidable";
import Audio from "#/models/audio";
import { PopulatedFavList } from "#/@types/audio";

interface CreateAudioRequest extends RequestWithFiles {
  body: {
    title: string;
    about: string;
    category: categoriesTypes;
  };
}

export const createAudio: RequestHandler = async (
  req: CreateAudioRequest,
  res: any
) => {
  const { title, about, category } = req.body;
  const poster = req.files?.poster as formidable.File;
  const audioFile = req.files?.file as formidable.File;
  const ownerId = req.user.id;
  if (!audioFile)
    return res.status(422).json({ error: "Audio file is missing" });


  //Upload the audio
  const audioRes = await cloudinary.uploader.upload(audioFile.filepath, {
    resource_type: "video",
  });
  //save in audio scheam
  const newAudio = new Audio({
    title,
    category,
    about,
    owner: ownerId,
    file: { url: audioRes?.secure_url, publicId: audioRes.public_id },
  });
  //if poster exist
  if (poster) {
    //Upload the poster
    const PosterRes = await cloudinary.uploader.upload(poster.filepath, {
      width: 300,
      height: 300,
      crop: "thumb",
      gravity: "face",
    });
    // update the poster
    newAudio.poster = {
      url: PosterRes.url,
      publicId: PosterRes.public_id,
    };
  }

  // /save audio
  await newAudio.save();

  //send response
  res.status(201).json({
    audio: {
      title,
      about,
      file: newAudio.file.url,
      poster: newAudio.poster?.url,
    },
  });
};


export const updateAudio: RequestHandler = async (
  req: CreateAudioRequest,
  res: any
) => {
  const { title, about, category } = req.body;
  const poster = req.files?.poster as formidable.File;
  const ownerId = req.user.id;
  const { audioId } = req.params;
  console.log("aduio id :", audioId); // route audio/audioId

  //find id audio exist in db adn update the record
  const audio = await Audio.findOneAndUpdate(
    { _id: audioId },
    { title, about, category },
    { new: true }
  );
  if (!audio) return res.status(404).json({ error: "Audio doesn't exist" });

  //if poster exist
  if (poster) {
    //delete poster
    if (audio.poster?.publicId) {
      await cloudinary.uploader.destroy(audio.poster.publicId);
    }

    //Upload the poster
    const PosterRes = await cloudinary.uploader.upload(poster.filepath, {
      width: 300,
      height: 300,
      crop: "thumb",
      gravity: "face",
    });
    // update the poster
    audio.poster = {
      url: PosterRes.url,
      publicId: PosterRes.public_id,
    };
    // /save audio with new poster
    await audio.save();
  }

  //send response
  res.status(201).json({
    audio: { title, about, file: audio.file.url, poster: audio.poster?.url },
  });
};

export const getLatestUploads: RequestHandler = async (req, res: any) => {
  const list = await Audio.find()
    .sort("-craetedAt")
    .limit(10)
    .populate<PopulatedFavList>("owner");

  const audios = list.map((item) => {
    return {
      id: item._id,
      file: item.file.url,
      title: item.title,
      about: item.about,
      category: item.category,
      poster: item.poster,
      owner: { name: item.owner.name, id: item.owner._id },
    };
  });
  res.json({ audios });
};


