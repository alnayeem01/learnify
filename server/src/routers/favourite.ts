import { getFavs, getIsFav, toggleFavourite } from "#/controllers/favourite";
import { isVerified, mustAuth } from "#/middleware/auth";
import { Router } from "express";


const router = Router();


//manage fav list and  aduio like array
// /favourite?audioId=6815d331908f8440dd7abbb6
router.post("/", mustAuth, isVerified, toggleFavourite);


//get fav list for a user
router.get("/", mustAuth, isVerified, getFavs);

router.get("/is-fav", mustAuth, isVerified, getIsFav)


export default router