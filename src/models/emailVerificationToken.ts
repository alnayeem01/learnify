// Interface (typescript)
import { Model, model, ObjectId, Schema } from "mongoose";
import {compare, hash} from 'bcrypt'

interface EmailVerificationTokenDocument {
   owner : ObjectId;
   token : string;
   createdAt : Date;
};

interface Methods{
    compareToken(Token : string) : Promise<boolean>
}

// expire token after 1 hour

const emailVerificationSchema =  new Schema<EmailVerificationTokenDocument, {}, Methods>({  
     owner : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "User"
     },
     token :{
        type : String,
        required : true
     },
     createdAt :{
        type : Date,
        expires : 3600 , // 60 min * 60 sec = 3600s
        default : Date.now
     }
    });

emailVerificationSchema.pre("save", async function(next){
    // hash  the token 
    if(this.isModified("token")){
        this.token = await hash(this.token, 10)
    }
    next()
});

emailVerificationSchema.methods.compareToken  = async function(token){
    const result = await compare(token, this.token)
    return result
}

// Ref and model name must match 
// To add types use Model from mongoose

export default model("EmailVerificationToken", emailVerificationSchema) as Model<EmailVerificationTokenDocument, {}, Methods>