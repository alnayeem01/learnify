import * as yup from 'yup'
import { isValidObjectId } from 'mongoose';
import { categories } from './audioCategory';

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

export const AudioValidationSchema = yup.object().shape({
    title: yup.string().required("Title is missing!"),
    about: yup.string().required("About is missing!"),
    category: yup.string().oneOf(categories, "Invalid category!").required("Category is missing!")
});

 
export const PlaylistValidationSchema = yup.object().shape({
    title: yup.string().required("Title is missing!"),
    resId: yup.string().transform(function(value){
        return this.isType(value) && isValidObjectId(value) ? value : ""
    }),
    visibility: yup.string().oneOf(["public", "private"], "visibility must be public or private").required("Category is missing!")
});

export const OldPlaylistValidationSchema = yup.object().shape({
    title: yup.string().required("Title is missing!"),
    // this is going to vaidate the id 
    item: yup.string().transform(function(value){
        return this.isType(value) && isValidObjectId(value) ? value : ""
    }),
    //this is going to validate the id 
    id: yup.string().transform(function(value){
        return this.isType(value) && isValidObjectId(value) ? value : ""
    }),
    visibility: yup.string().oneOf(["public", "private"], "visibility must be public or private")
    // .required("Category is missing!") 
    // (not needed as already got validated in playlist cration time )
});
export const updateHistoyValidationSchema = yup.object().shape({
   audio: yup.string().transform(function (value){
    return this.isType(value) && isValidObjectId(value) ? value :""
   }).required("Invalid audio id!"),
   progress: yup.number().required("History progess is missing!"),
   date: yup.string().transform(function (value){
    const date = new  Date(value)
    if(date instanceof(Date)) return value;
    return ""
   }).required("Invalid date!")


});