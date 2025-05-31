import  {Response, Router} from 'express';


import { validate } from '#/middleware/validator'
import { CreateUserSchema, EmailVerificationBody, SignInValidationSchema, TokenAndIdValidation, UpdatePasswordSchema } from '#/utils/validationSchema';
import { create, generateForgetPassowordLink, grantValid, logout, sendProfile, sendReVerificationToken, signIn, updatePassword, updateProfile, verifyEmail } from '#/controllers/auth';
import { isValidPasswordResetToken, mustAuth } from '#/middleware/auth';
import fileParser, { RequestWithFiles } from '#/middleware/fielParser';



const router = Router();



router.post("/create",validate(CreateUserSchema), create);


router.post("/verify-email",validate(EmailVerificationBody), verifyEmail);


router.post("/re-verify-email",sendReVerificationToken );

router.post("/forget-password", generateForgetPassowordLink );

router.post(
    "/verify-pass-reset-link",
     validate(TokenAndIdValidation),isValidPasswordResetToken,
     grantValid
);
    
router.post(
    "/update-password",
    validate(UpdatePasswordSchema),
    isValidPasswordResetToken,
    updatePassword 
);

router.post(
    "/sign-in",
    validate(SignInValidationSchema),
    signIn
 );

router.get("/is-auth",mustAuth,sendProfile);


router.post("/public",(req,res)=>{
    res.json({message :"You are in public route"})
});

router.post("/private",mustAuth,(req,res)=>{
    res.json({message: "You are in private route"})
});

router.post("/update-profile",mustAuth, fileParser, updateProfile);

// /auth/log-out/?fromAll=false or null
router.post("/log-out", mustAuth, logout);


export default router;