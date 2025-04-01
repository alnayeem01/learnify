// Interface (typescript)

import { Model, model, ObjectId, Schema } from "mongoose";

interface UserDocument {
    name : string;
    email : string;
    password : string;
    verified : boolean;
    avatar ?: { url : string; publicId : string };
    tokens: string
    favourites: ObjectId[];
    followers: ObjectId[];
    following: ObjectId[];
};

const userSchema =  new Schema<UserDocument>({ //Creating new schema 
      name: {
         type : String,
         required : true,
         trim : true
      },
      email: {
         type : String,
         required : true,
         trim : true,
         unique : true
      },
      password: {
         type : String,
         required : true,
      },
      verified: {
         type : Boolean,
         default : false,
      },
      avatar: {
         type : Object,
         url : String,
         publicId : String
      },
      favourites: [{
         type : Schema.Types.ObjectId,
         ref: "Audio",
      }],
      followers: [{
         type : Schema.Types.ObjectId,
         ref: "User"
      }],
      following: [{
         type : Schema.Types.ObjectId,
         ref:"User"
      }],
      tokens: [String],
    
}, {timestamps:true}); // this will timestamp all the updates 

// Ref and model name must match 
// To add types use Model from mongoose

export default model("User", userSchema) as Model<UserDocument>