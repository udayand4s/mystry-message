import {z} from 'zod';

export const messageSchema=z.object({
    content: z
        .string()
        .min(10, {message: "message must be of atleast 10 charecters "})
        .max(300, {message: "cant be bigger than 300 chars"})


})