import  {Response, Router} from 'express';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';


import { validate } from '#/middleware/validator'
import { CreateUserSchema, EmailVerificationBody, SignInValidationSchema, TokenAndIdValidation, UpdatePasswordSchema } from '#/utils/validationSchema';
import { create, generateForgetPassowordLink, grantValid, sendReVerificationToken, signIn, updatePassword, verifyEmail } from '#/controllers/user';
import { isValidPasswordResetToken, mustAuth } from '#/middleware/auth';



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

router.get("/is-auth",mustAuth,(req,res)=>{
    res.json({
        profile: req.user,
    })
});

router.post("/public",(req,res)=>{
    res.json({message :"You are in public route"})
});

router.post("/private",mustAuth,(req,res)=>{
    res.json({message: "You are in private route"})
});

router.post("/update-profile",async (req,res: any)=>{
    
    //content type must be multipart/form-data
    if (!req.headers["content-type"]?.startsWith("multipart/form-data"))
        return res.status(420).json({ error: "Only accepts form data" });
    
    //Uplaod path
    const dir = path.join(__dirname,"../public/profiles");

    //If uplaod folder isnt there create a new one usign fs module 
    try{
        await fs.readdirSync(dir)
    }catch(e){
        await fs.mkdirSync(dir)
    }
    
    //handle file upload
    const form = formidable({
        uploadDir : dir,
        filename(name, ext, part, form) {
            return Date.now()+ "_" + part.originalFilename
        },
    });
    form.parse(req, (err,fields,files) =>{
        // console.log("Fields: ", fields);
        // console.log("Files: ", files);

        res.json({uploaded: true});
    })
});


export default router;