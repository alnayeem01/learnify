import nodemailer from 'nodemailer'
import path from  "path"


import { MAILTRAP_PASSWORD, MAILTRAP_USER, SIGN_IN_URL, VERIFICATION_EMAIL } from "../utils/variables";
import emailVerificationToken from "#/models/emailVerificationToken";
import { generateTemplate } from "#/mail/template";

const generateEmailTransporter  = () => {
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
        user: MAILTRAP_USER,
        pass: MAILTRAP_PASSWORD
        }
    });

    return transport
};


// Send Otp
interface Profile {
    name: string,
    email: string,
    userId: string,
};
export const sendVerificationMail = async (token : string, profile : Profile) =>{
    //genrate otp
    const transport = generateEmailTransporter();

    const {name, email, userId} = profile
   

    const welcomeMessage = `Hi ${name}, Welcome to learnify! There are so much that we do for verified  users. Use the given OTP to verify your email.`;

    // mailtrap email 
    transport.sendMail({
        to : email,
        from : VERIFICATION_EMAIL,
        subject : 'Welcome message',
        html :  generateTemplate({
            title: 'Welcome to Learnify',
            message: welcomeMessage,
            link: "#",
            logo: "cid:logo",
            banner: "cid:welcome",
            btnTitle: token
        }),
        attachments: [
            {
                filename: "logo.png",
                path : path.join(__dirname,'../mail/images/logo.png' ), // to pass absolute path we used path module#
                cid : "logo" //cid- Content id
            },
            {
                filename: "welcome.png",
                path : path.join(__dirname,'../mail/images/welcome.png' ), // to pass absolute path we used path module#
                cid : "welcome" //cid- Content id
            },
        ]
    });
    
}


//send password reset link
interface Options{
    email : string;
    link : string;
}
export const sendForgetPasswordLink = async (options :Options) =>{
    //genrate otp
    const transport = generateEmailTransporter();

    const {email, link} = options
   

    const message = `Hi, We just received a request that you forgot your password. No problem you can use this link below to set up a brand new password.`

    // mailtrap email 
    transport.sendMail({
        to : email,
        from : VERIFICATION_EMAIL,
        subject : 'Reset Password Link',
        html :  generateTemplate({
            title: 'Forgot Password',
            message,
            link,
            logo: "cid:logo",
            banner: "cid:welcome",
            btnTitle: "Reset Password"
        }),
        attachments: [
            {
                filename: "logo.png",
                path : path.join(__dirname,'../mail/logo.png' ), // to pass absolute path we used path module#
                cid : "logo" //cid- Content id
            },
            {
                filename: "welcome.png",
                path : path.join(__dirname,'../mail/welcome.png' ), // to pass absolute path we used path module#
                cid : "welcome" //cid- Content id
            },
        ]
    });
    
}


// send password update email
interface Item{
    name : string,
    email : string
};
export const  sendPasswordResetSuccesEmail = async (item :Item) =>{
    //genrate otp
    const transport = generateEmailTransporter();

    const {name, email} = item;
   

    const message = `${name}, we just updated your password. You can now sign in with new password.`

    // mailtrap email 
    transport.sendMail({
        to : email,
        from : VERIFICATION_EMAIL,
        subject : 'Password Changed',
        html :  generateTemplate({
            title: 'Password changed successfully',
            message,
            link: SIGN_IN_URL,
            logo: "cid:logo",
            banner: "cid:welcome",
            btnTitle: "Log in"
        }),
        attachments: [
            {
                filename: "logo.png",
                path : path.join(__dirname,'../mail/logo.png' ), // to pass absolute path we used path module#
                cid : "logo" //cid- Content id
            },
            {
                filename: "welcome.png",
                path : path.join(__dirname,'../mail/welcome.png' ), // to pass absolute path we used path module#
                cid : "welcome" //cid- Content id
            },
        ]
    });
    
}





