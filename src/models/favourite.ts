
import { model, Model, ObjectId, Schema } from "mongoose";

interface FavouriteDocument{
    owner : ObjectId;
    items :ObjectId[];
}

const favouriteSchma = new Schema<FavouriteDocument>({
    owner : {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    items : [{
        type: Schema.Types.ObjectId,
        ref: "Audio"
    }]
},{ timestamps: true})

export default model("Favourite", favouriteSchma) as Model<FavouriteDocument>