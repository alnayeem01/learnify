import  {Response, Router} from 'express';


import { validate } from '#/middleware/validator'
import { CreateUserSchema, EmailVerificationBody, TokenAndIdValidation } from '#/utils/validationSchema';
import { create, generateForgetPassowordLink, isValidPassword, sendReVerificationToken, verifyEmail } from '#/controllers/user';

const router = Router();



router.post("/create",validate(CreateUserSchema), create);


router.post("/verify-email",validate(EmailVerificationBody), verifyEmail);


router.post("/re-verify-email",sendReVerificationToken );

router.post("/forget-password", generateForgetPassowordLink );

router.post("/verify-pass-reset-link", validate(TokenAndIdValidation), isValidPassword);


export default router;