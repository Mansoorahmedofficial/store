import { AuthOPtions } from "@/lib/auth";
import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";

const Handler = NextAuth(AuthOPtions)


export {Handler as GET, Handler as POST}