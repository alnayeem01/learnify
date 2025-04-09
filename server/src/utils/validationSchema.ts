import * as yup from 'yup'

export const CreateUserSchema = yup.object().shape({
    name: yup.string().trim().required("Name is missing").min(3, "Name is too short").max(20, "Name is too long"),
    email :yup.string().email("Invalid email id").required("Email is missing."),
    password : yup.string().trim().required("Password is missing!").min(8, "password must 8 characters long")
})


CreateUserSchema.validate