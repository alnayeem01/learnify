import { createAudio, getLatestUploads, updateAudio } from '#/controllers/audio';
import { isVerified, mustAuth } from '#/middleware/auth';
import fileParser from '#/middleware/fielParser';
import { validate } from '#/middleware/validator';
import { AudioValidationSchema } from '#/utils/validationSchema';
import { Router } from 'express'

const router = Router();


//create audio 
router.post("/create", mustAuth, isVerified, fileParser, validate(AudioValidationSchema), createAudio);

//update audio
router.post("/:audioId", mustAuth, isVerified, fileParser, validate(AudioValidationSchema), updateAudio);


//latest audio 
router.get("/latest", getLatestUploads)


export default router