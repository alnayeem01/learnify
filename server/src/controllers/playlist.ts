import { CreatePlaylistRequest, PopulatedFavList, updatePlaylistRequest } from "#/@types/audio";

import e, { RequestHandler } from "express";
import Audio from "#/models/audio";
import Playlist from "#/models/playlist";
import { isValidObjectId } from "mongoose";

export const createPlaylist: RequestHandler = async (
  req: CreatePlaylistRequest,
  res: any
) => {
  const { title, resId, visibility } = req.body;
  const ownerId = req.user.id;

  // while creating playlist there can be request
  //while new palylist name and the audio that user wants to store inside that playlist
  //or just want to create an empty playlist
  if (resId) {
    const audio = await Audio.findById(resId);
    if (!audio) return res.status(404).json({ error: "Audio not found!" });
  }

  //crate new playlist
  const newPlaylist = new Playlist({
    title,
    owner: ownerId,
    visibility,
  });
  if (resId) newPlaylist.items = [resId as any];
  await newPlaylist.save();

  res.status(201).json({
    playlist: {
      id: newPlaylist._id,
      title: newPlaylist.title,
      visibility: newPlaylist.visibility,
    },
  });
};

export const updatePlaylist: RequestHandler = async (
  req: updatePlaylistRequest,
  res: any
) => {
  // destruciton body
  const { id, item, title, visibility } = req.body;

  //find if playlist exist
  const playlist = await Playlist.findOneAndUpdate(
    {
      owner: req.user.id,
      _id: id,
    },
    {
      title,
      visibility,
    },
    { new: true }
  );
  if (!playlist) return res.status(404).json("playlsit not found!");

  //find if item exist
  if (item) {
    const audio = await Audio.findById(item);
    if (!audio) return res.status(404).json({ error: "The audio not found!" });

    //update items array if it doesn't exist already
    // const alreadyExists = playlist.items.some(
    //   (existing) => existing.toString() === audio._id.toString()
    // );
    // if (alreadyExists) res.json({ error: "Item already exists!" });

    // playlist.items.push(audio._id); //updated item in array
    // await playlist.save();

    await Playlist.findByIdAndUpdate(playlist._id, {
      $addToSet: { items: item },
    });
  }
  res.status(201).json({
    playlist: {
      id: playlist._id,
      title: playlist.title,
      visibility: playlist.visibility,
    },
  });
};

export const removePlaylist: RequestHandler = async (req, res: any) =>{
  //playlist ? playlistId=kmahskdj &r esId =foauiehdgoaishd & all=yes

  const { playlistId, resId, all } = req.query;
  if (all === "yes") {
    //delete the whole playlsit
    const playlist = await Playlist.findOneAndDelete({
      _id: playlistId,
      owner: req.user.id,
    });
    if (!playlist) return res.status(404).json("Playlist not found");
  }
  res.json({ success: true });
  if (resId) {
    if (!isValidObjectId(resId))
      return res.status(422).json({ error: "Invalid audio id!" });

    //update the array by deleting this one item
    const playlist = await Playlist.findOneAndUpdate(
      {
        _id: playlistId,
        owner: req.user.id,
      },
      { $pull: { items: resId } }
    );
    if (!playlist) return res.status(404).json("Playlist not found");
  } else {
    res.json({ error: "Item not found!" });
  }

  res.json({ success: true });
};

export const getPlaylistByProfile: RequestHandler = async (req, res)=>{

    const { pageNo ="0", limit="20" } = req.query as  {pageNo: string, limit: string}

    const data = await Playlist.find({
        owner : req.user.id,
        visibility: {$ne:'auto'}, //to exclude auto generated lists
    })
    //numebr of data should be skikpped
    .skip(parseInt(pageNo) * parseInt(limit))
    // number of data shoudl be fetched
    .limit(parseInt(limit))
    .sort('-createdAt'); //to sort based on the time it was created
    const playlist = data.map((item)=>{
        return{
            id: item._id,
            title: item.title,
            itemsCount: item.items.length,
            visibility: item.visibility
        }
    })
    res.json({playlist})
}

export const getAudios: RequestHandler = async(req, res:any)=>{
    const {playlistId} = req.params;
    if(!isValidObjectId(playlistId)) return res.status(422).json("Invalid playlist id");
    // from the playlsit we have to populate the audios
    const playlist = await Playlist.findOne({
        owner: req.user.id,
        _id: playlistId
    }).populate<{items: PopulatedFavList[]}>({path: "items",
        populate:{
        path:"owner",
        select : "name"
        },
    });

    if(!playlist) return res.json({error: "Playlist not found!"});

    const audios = playlist.items.map((item)=>{
        return {
            id: item._id,
            title: item.title,
            categoty: item.category,
            file: item.file.url,
            poster: item.poster?.url,
            owner: {name: item.owner.name, id: item.owner._id}
        }
    })
    res.json({list:{
        id: playlist._id,
        title:playlist.title,
        audios,
    }})
};

  