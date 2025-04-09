import express from "express";
import "dotenv/config";
import "./db";
import authRouter from './routers/auth';


const app = express();

// middlewares

app.use(express.json());
app.use(express.urlencoded({extended: false}));


const port = process.env.PORT || 5000;

//http//:localhost:500/cuth/create/ 
app.use("/auth", authRouter);


app.listen(port, () =>{
    console.log("The is server running on: http://localhost:" + port)
});

