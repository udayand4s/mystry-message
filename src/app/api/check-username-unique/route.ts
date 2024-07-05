import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
})

export async function GET(request: Request) {
    await dbConnect()

    //check for POST
    if (request.method!== 'GET') {
        return Response.json(
            {
                success: false,
                message: "Method not allowed"
            },
            {status: 405}
        )
    }

    try {
        const {searchParams}= new URL (request.url)
        const queryParam={
            username: searchParams.get('username')
        }

        const result= UsernameQuerySchema.safeParse(queryParam)
        console.log(result)
        if (!result.success) {
            const usernameErrors= result.error.format().
            username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length>0? usernameErrors.join(', ')
                : 'Invalid query paramaters'
            },{status: 400}
        )
        }

        const {username} = result.data

        const existingVerifiedUser= await UserModel.findOne({username, isVerified:true})
        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: 'username is already taken'
            },{status: 400}
        )
        }
        return Response.json({
            success: true,
            message: 'username is unique'
        },{status: 600}
    )
    } catch (error) {
        console.error("Error checking username", error)
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {status: 500}
        )
    }
}