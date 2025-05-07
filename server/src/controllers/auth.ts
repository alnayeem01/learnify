import { Request, RequestHandler } from "express";
import { isValidObjectId, Types } from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { CreateUser, VerifyEmailReq } from "#/@types/user";
import User from "#/models/user";
import { formatProfile, generateToken } from "#/utils/helper";
import {
  sendForgetPasswordLink,
  sendPasswordResetSuccesEmail,
  sendVerificationMail,
} from "#/utils/mail";
import emailVerificationToken from "#/models/emailVerificationToken";
import passwordResetToken from "#/models/passworResetToken";
import { JWT_SECRET, PASSWORD_RESET_LINK } from "#/utils/variables";
import { RequestWithFiles } from "#/middleware/fielParser";
import cloudinary from "#/cloud";
import formidable from "formidable";

export const create: RequestHandler = async (req: CreateUser, res:any) => {
  const { name, email, password } = req.body;

  //check if user exists
  const isUser = await User.findOne({email})
  if(isUser) return res.status(403).json({error: "User already exists!"});
    
  // create and save user
  const newUser = await User.create({ name, email, password });

  // Send verification email
  const token = generateToken();
  sendVerificationMail(token, { name, email, userId: newUser._id.toString() });
  // carete and save otp and other attribute
  await emailVerificationToken.create({
    owner: newUser._id,
    token,
  });

  res.status(201).json({
    User: { id: newUser._id, name: newUser.name, email: newUser.email },
  });
};

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailReq,
  res: any
) => {
  const { token, userId } = req.body;

  //Based on user ID find the user from emailVerificationToken schema
  const VerificationToken = await emailVerificationToken.findOne({
    owner: userId,
  });

  if (!VerificationToken)
    return res.status(401).json({ error: "Invalid ID token!" });

  // Comparing the token
  const matched = await VerificationToken.compareToken(token);

  if (!matched) return res.status(403).json({ error: "Invalid ID token!" });

  //If token is valid mark the user email as verified in User Schema

  // convert to objectID
  await User.findOneAndUpdate(new Types.ObjectId(userId), {
    verified: true,
  });

  await emailVerificationToken.findOneAndDelete(VerificationToken._id);

  res.json({ message: "Your email is verified." });
};

export const sendReVerificationToken: RequestHandler = async (
  req,
  res: any
) => {
  const { userId } = req.body;

  //validate user
  if (!isValidObjectId(userId))
    return res.status(403).json({ error: "Invalid request!" });

  //find user
  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Invalid request!" });

  //Check if user is already verified
  if (user.verified) return res.status(422).json({ error: "Email already verified!" });

  //delete old token
  await emailVerificationToken.findOneAndDelete({
    owner: userId,
  });

  //generate token
  const token = generateToken();

  //Create new token and send in mail
  await emailVerificationToken.create({
    owner: userId,
    token,
  });

  sendVerificationMail(token, {
    name: user?.name,
    email: user?.email,
    userId: user?._id.toString(),
  });

  res.json({ message: "Please check you mail." });
};

//to generate and send password reset link
export const generateForgetPassowordLink: RequestHandler = async (
  req,
  res: any
) => {
  const { email } = req.body;

  //find the user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "Account not found." });
  }
  // Generatre the link
  // https://yourapp.com/reset-password?token=dofahoehdla&userId=aoidsgoa

  const token: string = crypto.randomBytes(32).toString("hex");

  // Delete previos token
  await passwordResetToken.findOneAndDelete({
    owner: user._id,
  });

  await passwordResetToken.create({
    owner: user._id,
    token,
  });

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;

  // Email the forget password link to user email
  sendForgetPasswordLink({
    email,
    link: resetLink,
  });

  res.json({ message: "Check your registered mail for password reset link." });
};

//grant validation for new password
export const grantValid: RequestHandler = async (req, res) => {
  res.json({ valid: true });
};

//Update new password
export const updatePassword: RequestHandler = async (req, res: any) => {
  const { password, userId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ errro: "Unauthorised access" });

  const matched = await user.comparePassword(password);
  if (matched)
    return res
      .status(422)
      .json({ errro: "The new password must be diffrent!" });

  //save suer with new password
  user.password = password;
  await user.save();

  //delete password reset token
  await passwordResetToken.findOneAndDelete({ owner: user._id });

  sendPasswordResetSuccesEmail({ name: user.name, email: user.email });

  res.json({ message: "Password updated successfully" });
};

//user sign-in
export const signIn: RequestHandler = async (req, res: any) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(403).json({ error: "Error/Password mismatch" });

  //compare password
  const match = await user.comparePassword(password);
  if (!match) return res.status(403).json({ error: "Error/Password mismatch" });

  //generate JWT-token
  const token = jwt.sign({ userId: user._id }, JWT_SECRET);

  //Storing in User schema
  user.tokens.push(token);
  await user.save();

  res.json({
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
      followers: user.followers.length,
      following: user.following.length,
    },
    token,
  });
};


//upload new avatar
export const updateProfile: RequestHandler = async (
  req: RequestWithFiles,
  res:any
) => {
  const { name } = req.body;
  const avatar = req.files?.avatar as formidable.File;

   // Find the user by their ID
   const user = await User.findById(req.user.id);
  //  if (!user) {
  //    return res.status(404).json({ error: "User not found!" });
  //  }
  if(!user) throw new Error ("SOmethign went wrong, user not found!");

  if (typeof name !== "string")
    return res.status(422).json({ error: "Invalid name!" });

  if (name.trim().length < 3)
    return res.status(422).json({ error: "Invalid name!" });

  user.name = name;
  try{
    if (avatar) {
      // if there is already an avatar file, we want to remove that
      try{
        if(user.avatar?.publicId){
          await cloudinary.uploader.destroy(user.avatar?.publicId)
        }
      }catch(e){
        res.json({error: e})
      }
  
      // upload new avatar file
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        avatar.filepath,
        {
          width: 300,
          height: 300,
          crop: "thumb",
          gravity: "face",
        }
      );
  
      user.avatar = { url: secure_url, publicId: public_id };
    }
    
  }catch(e){
    res.json({error: e})
  }
  await user.save();

  res.json({ profile: formatProfile(user) });
};

//if user is authenticated send user profile
export const sendProfile : RequestHandler = async(req, res)=>{
  res.json({profile: req.user})
}

//logout 
export const logout : RequestHandler = async(req, res)=>{
  //logout and logout form all
  const {fromAll} =  req.query;

  const token = req.token;
  const user = await User.findById(req.user.id);
  if(!user) throw new Error ("Somethign went wrong, user not found!");

  //logout form all
  if(fromAll === "yes") user.tokens =[];
  else user.tokens = user.tokens.filter((t)=> t !== token);

  await user.save();
  res.status(200).json({success : "true"});
}

