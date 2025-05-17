import { Model, model, ObjectId, Schema } from "mongoose";


export type HistoryType ={ audio: ObjectId, progress: number, date: Date}

interface HistoryDocument {
    owner : ObjectId,
    last : HistoryType;
    all :HistoryType[];
};

const historySchema = new Schema<HistoryDocument>({
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    last:{
        audio : {
            type: Schema.Types.ObjectId,
            ref: "Audio",
        },
        progress: Number,
        date:{
            type:Date,
            required: true
        }
    },
    all: [{
        audio : {
            type: Schema.Types.ObjectId,
            ref: "Audio",
        },
        progress: Number,
        date:{
            type:Date,
            required: true
        }
    }]
}, {
    timestamps : true
});

export default model("History", historySchema) as Model<HistoryDocument>