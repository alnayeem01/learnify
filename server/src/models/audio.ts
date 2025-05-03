import { categories, categoriesTypes } from "#/utils/audioCategory";
import { Model, model, ObjectId, Schema } from "mongoose";


export interface AudioDocument< T =  ObjectId> {
    _id: ObjectId,
    title : string;
    about : string;
    owner : T;
    file : {
        url : string;
        pulicId : string;
    };
    poster ?:{
        url : string;
        publicId: string;
    };
    likes : ObjectId[];
    category : categoriesTypes,
    createdAt: Date;
}

const AudioSchema = new Schema<AudioDocument>({
    title: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    file :{
        type: Object,
        url: String,
        publicId : String,
        required : true,
    },
    poster :{
        type: Object,
        url: String,
        publicId : String
    },
    likes:[{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    category:{
        type: String,
        enum : categories ,
        default : "Others",
    },
}, {
    timestamps: true
});

export default model("Audio", AudioSchema) as Model<AudioDocument>