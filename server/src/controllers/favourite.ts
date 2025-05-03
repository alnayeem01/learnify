import { RequestHandler } from "express";
import { isValidObjectId, ObjectId } from "mongoose";
import Audio, { AudioDocument } from "../models/audio";
import Favourite from "../models/favourite";
import User from "#/models/user"; // adjust path
import { PopulatedFavList } from "#/@types/audio";

export const toggleFavourite: RequestHandler = async (req, res: any) => {
  const audioId = req.query.audioId as string;
  let status: "added" | "removed";
  if (!isValidObjectId(audioId))
    return res.json({ error: "Audio id is invalid" });

  const audio = await Audio.findById(audioId);
  if (!audio) return res.status(404).json({ error: "File doesn't exist" });
  //audio is already in favourite
  const alreadyExists = await Favourite.findOne({
    owner: req.user.id,
    items: audioId,
  });
  if (alreadyExists) {
    //we want to remove from there
    await Favourite.findOneAndUpdate(
      { owner: req.user.id },
      {
        // $pull is a built in operator : The $pull operator removes from an existing array all instances of a value or values that match a specified condition $pull: {field : value}
        $pull: { items: audioId },
      }
    );
    status = "removed";
  } else {
    const favourite = await Favourite.findOne({ owner: req.user.id });
    if (favourite) {
      //trying to add a new audio in old fav list
      Favourite.updateOne(
        { owner: req.user.id },
        {
          // $addToSet is a built in operator : The $addToSet operator adds a value to an array unless the value is already present, in which case $addToSet does nothing to that array.
          $addToSet: { items: audioId },
        }
      );
    } else {
      //trying to create a freah fav lilst
      await Favourite.create({ owner: req.user.id, items: [audioId] });
    }

    status = "added";
  }

  //if audo is added in users fav list incrase like array in audio schema
  if (status === "added") {
    await Audio.findByIdAndUpdate(audioId, {
      $addToSet: { likes: req.user.id },
    });
  }
  //if audo is removed in users fav list incrase like array in audio schema
  if (status === "removed") {
    await Audio.findByIdAndUpdate(audioId, {
      $pull: { likes: req.user.id },
    });
  }

  res.json({ status });
};

export const getFavs: RequestHandler = async (req, res: any) => {
  const userId = req.user.id;

  const favourite = await Favourite.findOne({ owner: userId })
  .populate<{items:PopulatedFavList[]}>({
    path: "items",
    populate: {
      path: "owner",
    },
  });
  if (!favourite) return res.json({ error: "List doesn't exist" });
  const audios = favourite.items.map((item) => {
    return {
        id: item._id,
        title :item.title,
        category: item.category,
        file: item.file.url,
        poster: item.poster?.url,
        owner: {owner: item.owner.name, id: item.owner._id}
    }
  });
  res.json({audios: audios });
};

export const getIsFav: RequestHandler = async (req, res: any) => {
    const audioId = req.query.audioId as string;
    if (!isValidObjectId(audioId)) return res.status(422).json({error: "Invalid audio Id!"})
  
    const favourite = await Favourite.findOne({ owner: req.user.id, items : audioId });
    if (!favourite) return res.json({ error: "List doesn't exist" });
    
    res.json({result: favourite? true : true});
  };
