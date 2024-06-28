import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export async function  sendVerificationEmail(
    email: string,
    username: string,
    otp: string
): Promise<ApiResponse> {
    try{
        await resend.emails.send({
            from: 'you@example.com',
            to: email,
            subject: "MystryMessage | Verification Code",
            react: VerificationEmail({ username, otp }),
          });
        return {success: true, message:"success"}
    } catch(emailError){
        console.error(emailError)
        return {success: false, message:"failed to send email"}
    }
}