import express from "express";
import "dotenv/config";
import "./db";
import authRouter from './routers/auth';
import audioRouter from './routers/audio'


const app = express();

// middlewares

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('src/public/'))

const port = process.env.PORT || 5000;

//http//:localhost:500/auth/create/ 
app.use("/auth", authRouter);

//http//:localhost:500/auth/create/ 
app.use("/audio", audioRouter);


app.listen(port, () =>{
    console.log("The is server running on: http://localhost:" + port)
});

