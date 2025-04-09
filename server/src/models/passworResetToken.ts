import { Model, model, ObjectId, Schema } from "mongoose"
import { compare, hash } from "bcrypt";


interface ResetPasswordTokenDocument{
    owner : ObjectId;
    token : string;
    createdAt : Date;
};

interface Methods{
    compareToken(token : string): 
    Promise <boolean>
};

const ResetPasswordTokenSchema = new Schema<ResetPasswordTokenDocument,{},Methods >({
    owner :{
        type : Schema.Types.ObjectId,
        required : true,
        ref : "User"
    },
    token :{
        type : String,
        required: true,
    },
    createdAt : {
        type : Date,
        expires : 3600,
        default : Date.now(),
    },
});

ResetPasswordTokenSchema.pre("save", async function(next){
    // hash  the token 
    if(this.isModified("token")){
        this.token = await hash(this.token, 10)
    }
    next()
});

ResetPasswordTokenSchema.methods.compareToken = async function (token) {
    const result = await compare(token, this.token);
    return result
}

export default model("ResetPasswordToken", ResetPasswordTokenSchema) as Model<ResetPasswordTokenDocument, {}, Methods>