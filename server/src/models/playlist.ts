import { Model, model, ObjectId, Schema } from "mongoose";


interface PlaylistDocument{
    title : string;
    owner : ObjectId,
    items : ObjectId[],
    visibility : "public" | "private" | "auto";
}

const playlistSchema = new Schema<PlaylistDocument>({
    title : {
        type: String,
        required :true
    },
    owner : {
        type : Schema.Types.ObjectId,
        require: true,
        ref : ("User")
    },
    items :[{
        type : Schema.Types.ObjectId,
        require: true,
        ref : ("Audio")
    }],
    visibility :{
        type : String,
        enum : ["public", "private", "auto"],
        default : "public"
    }
},{
    timestamps: true
});

export default model("Playlist",  playlistSchema) as Model<PlaylistDocument>