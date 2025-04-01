import { log } from "console"
import mongoose from "mongoose"
import { MONGO_URI } from "#/utils/variables";



mongoose
    .connect(MONGO_URI)
    .then( ()=>{
        console.log("The db is connected");
    })
    .catch((e)=>{
        console.log("Error connecting ot hte server: " + e);
    });