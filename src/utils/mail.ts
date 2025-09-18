
import path from "path";
import { MailtrapClient } from "mailtrap";

import {
  SIGN_IN_URL,
  MAILTRAP_API_KEY,
} from "../utils/variables";
import fs from "fs";
import { generateTemplate } from "#/mail/template";

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
    email: "hello@alnayeem.com",
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
  const { email, link } = options;

  const message = `Hi, We just received a request that you forgot your password. No problem you can use this link below to set up a brand new password.`;

  const client = new MailtrapClient({
    token: MAILTRAP_API_KEY,
  });
  const sender = {
    email: "hello@alnayeem.com",
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
    subject: "Reset Password Link",
    html: generateTemplate({
      title: "Forgot Password",
      message: message,
      link: link,
      logo: "cid:logo",
      banner: "cid:welcome",
      btnTitle: "Reset Password",
    }),
    category: "Password reset",
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

// send password update email
interface Item {
  name: string;
  email: string;
}
export const sendPasswordResetSuccesEmail = async (item: Item) => {
  //genrate otp

  const { name, email } = item;

  const message = `${name}, we just updated your password. You can now sign in with new password.`;

  const client = new MailtrapClient({
    token: MAILTRAP_API_KEY,
  });
  const sender = {
    email: "hello@alnayeem.com",
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
    subject: "Password Changed",
    html: generateTemplate({
      title: "Password changed successfully",
      message: message,
      link: SIGN_IN_URL,
      logo: "cid:logo",
      banner: "cid:welcome",
      btnTitle: "Log in",
    }),
    category: "Passoword reser update!",
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
