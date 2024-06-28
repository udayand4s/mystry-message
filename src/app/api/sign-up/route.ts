//end point:--> /api/signUp
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect()
  try {
    const reqBody = await request.json();
    const { email, username, password } = reqBody;

      //if  user with verified Username already  exists
      const existingUserByVerifiedUsername = await UserModel.findOne({
        username,
        isVerified: true,
      });
      if (existingUserByVerifiedUsername){
        return Response.json({
          success: false,
          message: "Username is already taken",
      }, {status: 400});
      }
    
    
    
    // if user  with email already exists
    const existingUserByEmail = await UserModel.findOne
    ({email});
    //generate OTP for verification mail
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified){
        return Response.json({
          success: false,
          message: "User already exists with email",
        },{status: 400});
      }else{
        const hashedPassword=await bcrypt.hash(password, 10)
        existingUserByEmail.password=hashedPassword,
        existingUserByEmail.verifyCode= verifyCode,
        existingUserByEmail.verifyCodeExpiry= new Date(Date.now() + 3600000)
      }
      }
    
      // user might have forgot his password { trying resetting it }:: email exists but not verified
    else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate=new Date()
        expiryDate.setHours(expiryDate.getHours() + 1)

        const newUser = new UserModel({
          username,
          password: hashedPassword,
          email,
          verifyCode,
          verifyCodeExpiry: expiryDate,
          isVerified: false,
          isAcceptingMessage: true,
          messages: []
        })
        await newUser.save()
      }
      
      //send verification email
      const emailResponse = await sendVerificationEmail(
        email,
        username, 
        verifyCode);

    //if error encountered
    if (!emailResponse.success) {
      return Response.json({
        success: false,
        message: emailResponse.message,
      },{status: 500});
    }
    //email sent successfully
    return Response.json({
      success: true,
      message: "Verification Email sent successfully",
    });

  } catch (error) {
    console.log("error encountered while registering user", error);
    return Response.json({
      success: false,
      message: "Error encountered while registering user",
    });
  }
}