import passwordResetToken from "#/models/passworResetToken";
import { JWT_SECRET } from "#/utils/variables";
import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import User from '#/models/user'



//to verify token
export const isValidPasswordResetToken: RequestHandler = async (req, res: any, next) => {
    const { token, userId } = req.body;
    console.log(req.body);
  
    //token in  DB for this user
    const resetToken = await passwordResetToken.findOne({
      owner: userId
    });
    
    if (!resetToken) return res.status(403).json({error : "Unauthorised acceess, Invalid token"});
  
  
    const match = await resetToken.compareToken(token);
  
    if (!match) return res.status(403).json({error : "Invalid token"});
  
    next();
  };

export const mustAuth :RequestHandler = async (req,res:any, next)=>{
  const {authorization} = req.headers
  const token = authorization?.split("Bearer ")[1];

  if(!token) return res.status(403).json({error: "Unauthoruised request"});

  //verify method from jwt 
  const verifiedToken = verify(token, JWT_SECRET) as JwtPayload;
  const id = verifiedToken.userId 

  const user = await User.findOne({_id: id, tokens: token});
  if(!user) return res.status(400).json({error:"Unauthorised access."})

  req.user={
    id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verified,
    avatar: user.avatar?.url,
    followers: user.followers.length,
    following: user.following.length,
  }
  next()
};