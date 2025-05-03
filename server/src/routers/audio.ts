import { createAudio, updateAudio } from '#/controllers/audio';
import { isVerified, mustAuth } from '#/middleware/auth';
import fileParser from '#/middleware/fielParser';
import { validate } from '#/middleware/validator';
import { AudioValidationSchema } from '#/utils/validationSchema';
import { Router } from 'express'

const router = Router();

router.post("/create", mustAuth, isVerified, fileParser, validate(AudioValidationSchema), createAudio);

router.post("/:audioId", mustAuth, isVerified, fileParser, validate(AudioValidationSchema), updateAudio);


export default router