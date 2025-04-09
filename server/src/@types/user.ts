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