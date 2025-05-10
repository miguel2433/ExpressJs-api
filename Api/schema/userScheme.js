import {z } from 'zod'; // Asegúrate de que la ruta sea correcta

const userScheme = z.object({
    idNationality: z.number({
        invalid_type_error: "idNationality must be a number",
        required_error: "idNationality is required"
    }).min(0).max(10, {message: "the max number must be minus than 10"}),
    name: z.string({
        invalid_type_error: "name must be a string",
        required_error: "the name is required"
    }).max(45, {message: "the max of characters can be written its 45"}),
    email: z.string({
        required_error: "the email is required"
    }).email({ message: "Invalid email format" }),
    password: z.string({
        invalid_type_error: "the password must be a string",
        required_error: "the password is required"
    }).min(0,{message: "the min of characters in the password its 0"}).max(10, {message: "the max of characthers in the password is 10"})
})

export function ValidateUser(object){
    return userScheme.safeParse(object)
}

export function ValidatePartialUser(object){
    return userScheme.partial().safeParse(object)
}