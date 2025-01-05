import {DefualtSession} from "next-auth"

declare module "next-auth"{
    interface Session{
        user:{
            role:string, 
            id:string
        } & DefualtSession['user']
    }
    
    interface User{
        role:string
    }
}