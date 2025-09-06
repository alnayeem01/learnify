import { RequestHandler } from "express";
import { isValidObjectId, ObjectId } from "mongoose";
import Audio, { AudioDocument } from "../models/audio";
import Favourite from "../models/favourite";
import User from "#/models/user"; // adjust path
import { PopulatedFavList } from "#/@types/audio";
import { paginationQuery } from "#/@types/misc";
import { File } from "node:buffer";

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
      await Favourite.updateOne(
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
  const {pageNo="0", limit ="20"} = req.query as paginationQuery;
  
  const favourites = await Favourite.aggregate([
    {$match: {owner: userId}},
    //usign project query we will slice the favourites according to pagiantion 
    {
      $project:{
        audioIds:{
          $slice:["$items", parseInt(pageNo) * parseInt(limit), parseInt(limit)]
        }
      }
    },
    {
      $unwind: "$audioIds"
    },
    {
      $lookup :{
        from: "audios",
        localField: "audioIds",
        foreignField: "_id",
        as:"audioInfo"
      }
    },
    {$unwind: "$audioInfo"},
    {
      $lookup :{
        from: "users",
        localField: "audioInfo.owner",
        foreignField: "_id",
        as:"ownerInfo"
      }
    },
    {$unwind: "$ownerInfo"},
    {
      $project: {
        _id: 0,
        id: "$audioInfo._id",
        title: "$audioInfo.title",
        about : "$audioInfo.about",
        file : "$audioInfo.file.url",
        category: "$audioInfo.category",
        poster : "$audioInfo.poster.url",
        owner: {name: "$ownerInfo.name", id: "$ownerInfo._id"}
      }
    }
  ]);

  res.json({audios: favourites})

};

export const getIsFav: RequestHandler = async (req, res: any) => {
    const audioId = req.query.audioId as string;
    if (!isValidObjectId(audioId)) return res.status(422).json({error: "Invalid audio Id!"})
  
    const favourite = await Favourite.findOne({ owner: req.user.id, items : audioId });
    
    res.json({result: favourite? true : false});
  };
