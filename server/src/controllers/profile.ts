import { RequestHandler } from "express";
import { isValidObjectId, ObjectId } from "mongoose";
import User from "#/models/user";
import { paginationQuery } from "#/@types/misc";
import Audio, { AudioDocument } from "#/models/audio";
import Playlist from "#/models/playlist";

export const updateFollower: RequestHandler = async (req, res: any) => {
  //user want to follow this profile id
  const { profileId } = req.params; // the id that user want to follow
  let status: "added" | "removed";

  if (!isValidObjectId(profileId))
    return res
      .status(422)
      .json({ error: "Something went wrong, User not found" });

  const profile = await User.findById(profileId);
  if (!profile)
    return res
      .status(422)
      .json({ error: "Something went wrong, profile not found!" });

  // Chech if user already is a follower
  const alreadyAFollower = await User.findOne({
    _id: profileId,
    followers: req.user.id,
  });
  if (alreadyAFollower) {
    // un follow
    await User.updateOne(
      {
        _id: profileId,
      },
      {
        $pull: { followers: req.user.id },
      }
    );

    status = "removed";
    //follow
  } else {
    await User.updateOne(
      {
        _id: profileId,
      },
      {
        $addToSet: { followers: req.user.id },
      }
    );
    status = "added";
  }

  if (status === "added") {
    //update the following list
    await User.updateOne(
      { _id: req.user.id },
      {
        $addToSet: {
          following: profileId,
        },
      }
    );
  }

  if (status === "removed") {
    //remove from the followign list
    await User.updateOne(
      { _id: req.user.id },
      {
        $pull: {
          following: profileId,
        },
      }
    );
  }
  res.json({ status });
};

//get all uploaded audios by requested user
export const getUploads: RequestHandler = async (req, res: any) => {
  const { pageNo = "0", limit = "20" } = req.query as paginationQuery;

  //find user form mustAuth middleWare
  const data = await Audio.find({ owner: req.user.id })
    .skip(parseInt(limit) * parseInt(pageNo))
    .limit(parseInt(limit))
    .sort("-cratedAt");

  if (!data) return res.json("Audio not found");

  const audio = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      about: item.about,
      file: item.file.url,
      poster: item.poster?.url,
      data: item.createdAt,
      owner: {
        name: req.user.name,
        id: req.user.id,
      },
    };
  });
  res.json({ audio });
};

// get public uploads of any user
export const getPublicUploads: RequestHandler = async (req, res: any) => {
  const { pageNo = "0", limit = "20" } = req.query as paginationQuery;

  const { profileId } = req.params;
  if (!isValidObjectId(profileId))
    return res.status(422).json({ error: "Invalid profile!" });

  //find audios uploaded by public
  const data = await Audio.find({ owner: profileId })
    .skip(parseInt(limit) * parseInt(pageNo))
    .limit(parseInt(limit))
    .sort("-createdAt")
    .populate<AudioDocument<{ name: string; _id: ObjectId }>>("owner");

  if (!data) return res.json("Audio not found");

  const audio = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      about: item.about,
      file: item.file.url,
      poster: item.poster?.url,
      data: item.createdAt,
      owner: {
        name: item.owner.name,
        id: item.owner._id,
      },
    };
  });
  res.json({ audio });
};

// get profile info
export const getPublicProfile: RequestHandler = async (req, res: any) => {
  const { profileId } = req.params;
  if (!isValidObjectId(profileId))
    return res
      .status(422)
      .json({ error: "Something went wrong, Invalid profile" });

  const user = await User.findById(profileId);
  if (!user)
    return res.json({ error: "Something went wrong, user not found!" });

  res.json({
    proflile: {
      id: user._id,
      name: user.name,
      email: user.email,
      followers: user.followers.length,
      following: user.following.length,
      avatar: user.avatar?.url,
    },
  });
};

// get profile info
export const getPublicPlaylist: RequestHandler = async (req, res: any) => {
  const { pageNo = "0", limit = "20" } = req.query as paginationQuery;
  const { profileId } = req.params;
  if (!isValidObjectId(profileId))
    return res
      .status(422)
      .json({ error: "Something went wrong, Invalid profile" });

  //find public playlists
  const playlist = await Playlist.find({
    owner: profileId,
    visibility: "public",
  })
    .skip(parseInt(limit) * parseInt(pageNo))
    .limit(parseInt(limit))
    .sort("-createdAt");

  if (!playlist)
    return res
      .status(404)
      .json({ error: "Something went wrong, profile not found!" });

  res.json({
    playlist: playlist.map((item) => {
      return {
        id: item._id,
        title: item.title,
        itemsCount: item.items.length,
        visibility: item.visibility,
      };
    }),
  });
};
