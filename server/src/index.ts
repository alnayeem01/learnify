import express from "express";
import "dotenv/config";
import "./db";
import authRouter from './routers/auth';
import audioRouter from './routers/audio'
import favouriteRouter from './routers/favourite'
import playlistRouter from './routers/playlist'
import profileRouter from '#/routers/profile'
import historyRouter from '#/routers/history'


const app = express();

// middlewares

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('src/public/'))

const port = process.env.PORT || 5000;

//http//:localhost:500/auth/
app.use("/auth", authRouter);

//http//:localhost:500/audio//
app.use("/audio", audioRouter);

//http//:localhost:500/favourites//
app.use("/favourite", favouriteRouter);

//http//:localhost:500/playlist//
app.use("/playlist", playlistRouter);

//http//:localhost:500/profile/
app.use("/profile", profileRouter);

//http//:localhost:500/profile/
app.use("/history", historyRouter);



app.listen(port, () =>{
    console.log("The is server running on: http://localhost:" + port)
});

