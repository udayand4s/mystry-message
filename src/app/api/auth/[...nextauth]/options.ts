import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions={
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
              },
            async authorize(credentials: any): Promise<any> {
                await dbConnect()
                try{
                    const user= await UserModel.findOne({
                        $or:[
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })
                    if (!user) {
                        throw new Error('No user found');
                    }
                    if (!user.isVerified){
                        throw new Error("Verify your account")
                    }
                    const isPasswordCorrect=await bcrypt.compare(credentials.password, user.password)
                    if (isPasswordCorrect){
                        return user
                    } else {
                        throw new Error ("inccorect password")
                    }
                }catch(err:any){
                    throw new Error(err)
                }
            }
            
        })
    ],
    
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async session({ session, token}) {
            return session
          },
          async jwt({ token, user}) {
            return token
            },
        },
}