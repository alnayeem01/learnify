import { UserDocument } from "#/models/user";
import { Request } from "express";
import History from "#/models/history";
import moment from "moment";

export const generateToken = (length = 6) => {
  // Declare variable
  let otp = "";
  for (let i = 0; i < length; i++) {
    const digit = Math.floor(Math.random() * 10);
    otp += digit;
  }

  return otp;
};

export const formatProfile = (user: UserDocument) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verified,
    avatar: user.avatar?.url,
    followers: user.followers.length,
    following: user.following.length,
  };
};

export const getUsersPreviousHistory = async (
  req: Request
): Promise<string[]> => {
  //fetch users previous history
  const [result] = await History.aggregate([
    { $match: { owner: req.user.id } },
    {
      $unwind: "$all",
    },
    {
      $match: {
        //want to match history that are not older than 30 days
        "all.date": {
          $gte: moment().subtract(30, "days").toDate(),
        },
      },
    },
    { $group: { _id: "$all.audio" } },
    {
      $lookup: {
        from: "audios",
        localField: "_id",
        foreignField: "_id",
        as: "audioData",
      },
    },
    { $unwind: { path: "$audioData" } },
    {
      $group: { _id: null, category: { $addToSet: "$audioData.category" } },
    },
  ]);
  
  if(result){
    return result.category
  }

  return [];
};
