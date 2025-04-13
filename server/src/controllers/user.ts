import { RequestHandler } from "express";
import { isValidObjectId, Types } from "mongoose";
import crypto from 'crypto'

import { CreateUser, VerifyEmailReq } from "#/@types/user";
import User from '#/models/user';
import { generateToken } from "#/utils/helper";
import { sendForgetPasswordLink, sendVerificationMail } from "#/utils/mail";
import emailVerificationToken from "#/models/emailVerificationToken";
import passworResetToken from "#/models/passworResetToken";
import { PASSWORD_RESET_LINK } from "#/utils/variables";


export const create :RequestHandler =async (req : CreateUser , res)=>{
    const {name, email, password} = req.body;

    // create and save user
    const newUser = await User.create({name, email, password});

    // Send verification email 
    const token = generateToken();
    sendVerificationMail(token, {name, email, userId : newUser._id.toString() } )
     // carete and save otp and other attribute
    await emailVerificationToken.create({
        owner : newUser._id,
        token
    })
   

    res.status(201).json({ 
        User : {id : newUser._id, 
        name : newUser.name, 
        email : newUser.email}
    });
}

export const verifyEmail :RequestHandler =async (req : VerifyEmailReq , res: any) =>{
    const { token, userId } =req.body;
    
    //Based on user ID find the user from emailVerificationToken schema
    const VerificationToken =await emailVerificationToken.findOne({
        owner : userId
    });

    if (!VerificationToken) return res.status(401).json({error : "Invalid ID token!"})

    // Comparing the token
    const matched = await VerificationToken.compareToken(token);

    if (!matched) return res.status(403).json({error : "Invalid ID token!"})

    //If token is valid mark the user email as verified in User Schema

    // convert to objectID 
    await User.findOneAndUpdate(new Types.ObjectId(userId),{
        verified : true
    });

    await emailVerificationToken.findOneAndDelete(VerificationToken._id);
    
    res.json({message: "Your email is verified."});
}

export const sendReVerificationToken: RequestHandler = async (req, res: any) => {
    const { userId } = req.body;
    
    //validate user
    if (!isValidObjectId(userId))
      return res.status(403).json({ error: "Invalid request!" });
    
    //find user 
    const user = await User.findById(userId);
    if (!user) return res.status(403).json({ error: "Invalid request!" });
    
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


export const generateForgetPassowordLink: RequestHandler = async (req, res: any) => {
  const { email } = req.body;
  

  //find the user
  const user = await User.findOne({email});
  if(!user){
      return res.status(404).json({error: "Account not found."})
  };
  // Generatre the link 
  // https://yourapp.com/reset-password?token=dofahoehdla&userId=aoidsgoa

  const token : string = crypto.randomBytes(32).toString();


  // Delete previos token 
  await passworResetToken.findOneAndDelete({
    owner: user._id
  });


  passworResetToken.create({
    owner : user._id,
    token
  });

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`

  // Email the forget password link to user email 
  sendForgetPasswordLink({
    email,
    link: resetLink
  });

  res.json({message: "Check your registered mail for password reser link."});

};

export const isValidPassword: RequestHandler = async (req, res: any) => {
  const { token, userId } = req.body;

  const resetToken = await passworResetToken.findOne({
    owner: userId
  });
  
  if (!resetToken) return res.status(403).json({error : "Invalid token"});


  const match = await resetToken.compareToken(token);

  if (!match) return res.status(403).json({error : "Invalid token"});

  res.json({message: "Your token is valid."})

} 
  
  
  
  
  
    