import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ConenctDatabase } from "./Db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
export const AuthOPtions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || credentials.password) {
          throw new Error("invlid credentials");
        }
        try {
          await ConenctDatabase();
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("No user found");
          }
          const isValide = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValide) {
            throw new Error("invalide password");
          }
          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.log("auth error", error);
          throw error;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;

      return session;
    },
  },
  pages:{
    signIn:"/login",
    error:"/login"
  }, 
  session:{
  strategy:"jwt", 
  maxAge:30*24*60*60
  }, 
  secret:process.env.NEXTAUTH_SECRET
};
