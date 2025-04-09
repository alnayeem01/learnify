import nodemailer from 'nodemailer'
import path from  "path"


import { MAILTRAP_PASSWORD, MAILTRAP_USER, VERIFICATION_EMAIL } from "../utils/variables";
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

interface Profile {
    name: string,
    email: string,
    userId: string,
};


export const sendVerificationMail = async (token : string, profile : Profile) =>{
    //genrate otp
    const transport = generateEmailTransporter();

    const {name, email, userId} = profile
    // carete and save otp and other attribute
    await emailVerificationToken.create({
        owner : userId,
        token
    })

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





