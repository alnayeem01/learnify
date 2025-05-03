import { updateFollower } from '#/controllers/profile'
import { mustAuth } from '#/middleware/auth'
import Router from 'express'

const router = Router()

router.post('/update-follow/:profileId', mustAuth, updateFollower)

export default router