import express from "express";
import "dotenv/config"
import "./db"



const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) =>{
    res.send("Hello server");
})

app.listen(port, () =>{
    console.log("The is server running on: http://localhost:" + port)
});

