import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLICK_KEY!,
  privateKey:process.env.PRIVATE_KEY!, 
  urlEndpoint:process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

export async function GET() {
    try {
         const authicationPrameters = imagekit.getAuthenticationParameters()
         return NextResponse.json(authicationPrameters)
    } catch (error) {
        console.log('error imagekit', error)
    }

}
