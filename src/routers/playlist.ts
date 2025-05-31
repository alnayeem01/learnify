import { createPlaylist, getAudios, getPlaylistByProfile,  removePlaylist, updatePlaylist } from '#/controllers/playlist';
import { isAuth, mustAuth } from '#/middleware/auth';
import { validate } from '#/middleware/validator';
import { OldPlaylistValidationSchema, PlaylistValidationSchema } from '#/utils/validationSchema';
import Router from 'express'

const router = Router();

//crate new playlist 
router.post("/create", mustAuth, validate(PlaylistValidationSchema), createPlaylist)

//update items in playlist
router.patch("/update", mustAuth, validate(OldPlaylistValidationSchema), updatePlaylist)

//delete items in playlist
router.delete("/", mustAuth, removePlaylist)

//get playlist for user
router.get("/by-profile", mustAuth, getPlaylistByProfile);


//get playlist audio for user
router.get("/:playlistId", mustAuth, getAudios)




export default router