import { getPublicPlaylist, getPublicProfile, getPublicUploads, getUploads, updateFollower } from '#/controllers/profile'
import { mustAuth } from '#/middleware/auth'
import Router from 'express'

const router = Router()

//update follower 
router.post('/update-follower/:profileId', mustAuth, updateFollower);

// get uploads by user
router.get('/uploads', mustAuth, getUploads);

// get uploads from public 
router.get('/uploads/:profileId', getPublicUploads);

// get info of a public profie
router.get('/info/:publicId', getPublicProfile);

// get profie playlist
router.get('/playlist/:profileId', getPublicPlaylist);

export default router