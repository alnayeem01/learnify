import { RequestHandler } from "express";


import { CreateUser } from "#/@types/user";
import User from '#/models/user';
import { generateToken } from "#/utils/helper";
import { sendVerificationMail } from "#/utils/mail";


export const create :RequestHandler =async (req : CreateUser , res)=>{
    const {name, email, password} = req.body;

    // create and save user
    const newUser = await User.create({name, email, password});

    // Send verification email 
    const token = generateToken();
    sendVerificationMail(token, {name, email, userId : newUser._id.toString() } )
   

    res.status(201).json({ 
        User : {id : newUser._id, 
        name : newUser.name, 
        email : newUser.email}
    });
}