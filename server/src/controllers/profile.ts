import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import User from "#/models/user";

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

  if(status === "added"){
    //update the following list 
    await User.updateOne({_id: req.user.id}, {$addToSet:{
        following: profileId
    }})
  }

  if(status === "removed"){
    //remove from the followign list 
  }
};
