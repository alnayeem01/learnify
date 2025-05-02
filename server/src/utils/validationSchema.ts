import * as yup from 'yup'
import { isValidObjectId } from 'mongoose';

export const CreateUserSchema = yup.object().shape({
    name: yup
        .string()
        .trim()
        .required("Name is missing")
        .min(3, "Name is too short")
        .max(20, "Name is too long"),
    email :yup
        .string()
        .email("Invalid email id")
        .required("Email is missing."),
    password : yup
        .string()
        .trim()
        .required("Password is missing!")
        .min(8, "password must 8 characters long")
});

export const EmailVerificationBody = yup.object().shape({
    token : yup
        .string()
        .trim()
        .required("Invalid token"),
    userId: yup
        .string()
        .transform(function(value){
            if( this.isType(value) && isValidObjectId(value)){
                return value;
            }return ""
        }).required("Invalid user Id")
});

export const TokenAndIdValidation = yup.object().shape({
    token : yup
        .string()
        .trim()
        .required("Invalid token"),
    userId: yup
        .string()
        .transform(function(value){
            if( this.isType(value) && isValidObjectId(value)){
                return value;
            }return ""
        }).required("Invalid user Id")
});

export const UpdatePasswordSchema = yup.object().shape({
    token : yup
        .string()
        .trim()
        .required("Invalid token"),
    userId: yup
        .string()
        .transform(function(value){
            if( this.isType(value) && isValidObjectId(value)){
                return value;
            }return ""
        }).required("Invalid user Id"),
    password : yup
    .string()
    .trim()
    .required("Password is missing!")
    .min(8, "password must 8 characters long")
});

export const SignInValidationSchema = yup.object().shape({
    email : yup
        .string()
        .required("Email is missing!")
        .email("Invalid email id."),
    password : yup
        .string()
        .trim()
        .required("Password is missing!")
})