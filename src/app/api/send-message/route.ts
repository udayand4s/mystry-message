import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User"

export async function POST(request: Request) {
    await dbConnect()

    const {username, content}= await request.json()
    try {
        const user= await UserModel.findOne({username})
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "user not found"
                },
                {status: 404}
            ) 
        }

        //is user accepting messages
        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "user not accepting messages"
                },
                {status: 403}
            ) 
        }

        const newMessage= {content, createdAt: new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success: true,
                messages: "message sent succesfully "
            },
            {status: 401}
        ) 
    } catch (error) {
        console.log("error addding messages", error)
        return Response.json(
            {
                success: false,
                message: "error addding messages"
            },
            {status: 500}
        )
    }
}