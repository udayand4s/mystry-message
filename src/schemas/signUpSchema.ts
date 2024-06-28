import {z} from 'zod';

export const usernameValidation=z
    .string()
    .min(2, "username must be atleast 2 charecters")
    .max(2, "username must be no more than 20 charecters")
    .regex(/^[a-zA-Z0-9]+$/, "username must not be special charecter")

export const signUpSchema=z.object({
    username: usernameValidation,
    email: z.string().email({message: 'invalid email'}),
    password: z.string().min(6, {message: 'password must be atleast 6 chars'})

})