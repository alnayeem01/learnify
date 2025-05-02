// Interface (typescript)

import { compare, hash } from "bcrypt";
import { Model, model, ObjectId, Schema } from "mongoose";

interface UserDocument {
    name : string;
    email : string;
    password : string;
    verified : boolean;
    avatar ?: { url : string; publicId : string };
    tokens: [string]
    favourites: ObjectId[];
    followers: ObjectId[];
    following: ObjectId[];
};

interface Methods {
   comparePassword(password : string) :Promise<boolean>
}

const userSchema =  new Schema<UserDocument, {}, Methods>({ //Creating new schema 
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

// hash password

userSchema.pre("save", async function(next){
   if(this.isModified("password")){
      this.password = await hash(this.password, 10)
   }
   next()
});

userSchema.methods.comparePassword = async function (password){
   const result = await compare(password, this.password);
   return result
};

// Ref and model name must match 
// To add types use Model from mongoose

export default model("User", userSchema) as Model<UserDocument, {}, Methods>