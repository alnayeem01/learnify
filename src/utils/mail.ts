import nodemailer from "nodemailer";
import path from "path";
import { MailtrapClient } from "mailtrap";

import {
  MAILTRAP_PASSWORD,
  MAILTRAP_USER,
  SIGN_IN_URL,
  VERIFICATION_EMAIL,
  MAIILTRAP_API_KEY,
  MAILTRAP_API_KEY,
} from "../utils/variables";
import fs from "fs";
import { generateTemplate } from "#/mail/template";

const generateEmailTransporter = () => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASSWORD,
    },
  });

  return transport;
};

// Send Otp
interface Profile {
  name: string;
  email: string;
  userId: string;
}

//Email verification
export const sendVerificationMail = async (token: string, profile: Profile) => {
  const { name, email } = profile;
  const welcomeMessage = `Hi ${name}, Welcome to learnify! There are so much that we do for verified  users. Use the given OTP to verify your email.`;

  const client = new MailtrapClient({
    token: MAILTRAP_API_KEY,
  });

  const sender = {
    email: 'hello@alnayeem.com',
    name: "Learnify App",
  };
  const recipients = [
    {
      email: email,
    },
  ];

  const logoImage = fs.readFileSync(
    path.join(__dirname, "../mail/images/logo.png")
  );
  const WelcomeImage = fs.readFileSync(
    path.join(__dirname, "../mail/images/welcome.png")
  );

  client.send({
    from: sender,
    to: recipients,
    subject: "Verification email",
    html: generateTemplate({
      title: "Welcome to Learnify",
      message: welcomeMessage,
      link: "#",
      logo: "cid:logo",
      banner: "cid:welcome",
      btnTitle: token,
    }),
    category: "Verification Mail",
    attachments: [
      {
        filename: "logo.png",
        content_id: "logo",
        disposition: "inline",
        content: logoImage,
        type: "image/png",
      },
      {
        filename: "welcome.png",
        content_id: "welcome",
        disposition: "inline",
        content: WelcomeImage,
        type: "image/png",
      },
    ],
  });
};

//send password reset link
interface Options {
  email: string;
  link: string;
}
export const sendForgetPasswordLink = async (options: Options) => {
  //genrate otp
  const transport = generateEmailTransporter();

  const { email, link } = options;

  const message = `Hi, We just received a request that you forgot your password. No problem you can use this link below to set up a brand new password.`;

  // mailtrap email
  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "Reset Password Link",
    html: generateTemplate({
      title: "Forgot Password",
      message,
      link,
      logo: "cid:logo",
      banner: "cid:welcome",
      btnTitle: "Reset Password",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"), // to pass absolute path we used path module#
        cid: "logo", //cid- Content id
      },
      {
        filename: "welcome.png",
        path: path.join(__dirname, "../mail/welcome.png"), // to pass absolute path we used path module#
        cid: "welcome", //cid- Content id
      },
    ],
  });
};

// send password update email
interface Item {
  name: string;
  email: string;
}
export const sendPasswordResetSuccesEmail = async (item: Item) => {
  //genrate otp
  const transport = generateEmailTransporter();

  const { name, email } = item;

  const message = `${name}, we just updated your password. You can now sign in with new password.`;

  // mailtrap email
  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "Password Changed",
    html: generateTemplate({
      title: "Password changed successfully",
      message,
      link: SIGN_IN_URL,
      logo: "cid:logo",
      banner: "cid:welcome",
      btnTitle: "Log in",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"), // to pass absolute path we used path module#
        cid: "logo", //cid- Content id
      },
      {
        filename: "welcome.png",
        path: path.join(__dirname, "../mail/welcome.png"), // to pass absolute path we used path module#
        cid: "welcome", //cid- Content id
      },
    ],
  });
};
