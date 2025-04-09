import  {Response, Router} from 'express';


import { validate } from '#/middleware/validator'
import { CreateUserSchema, EmailVerificationBody } from '#/utils/validationSchema';
import { create, generateForgetPassowordLink, sendReVerificationToken, verifyEmail } from '#/controllers/user';

const router = Router();



router.post("/create",validate(CreateUserSchema), create);


router.post("/verify-email",validate(EmailVerificationBody), verifyEmail);


router.post("/re-verify-email",sendReVerificationToken );

router.post("/forget-password", generateForgetPassowordLink );


export default router;