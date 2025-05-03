import { Request } from "express";

export interface CreateUser extends Request {
    body :{
        name : string;
        email : string;
        password : string;
    };
};

export interface VerifyEmailReq extends Request {
    body :{
        token : string;
        userId : string;
    };
};

declare global {
  namespace Express{
    interface Request{
      user : {
        id: any,
        name: string,
        email: string,
        verified: boolean,
        avatar?: string,
        followers: number,
        following: number,
      }
      token : string
    }
  }
};
