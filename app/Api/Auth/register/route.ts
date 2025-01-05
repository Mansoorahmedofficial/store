import { ConenctDatabase } from "@/lib/Db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({
        error: "email or password are requried",
      });
    }
    await ConenctDatabase();
    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return NextResponse.json(
        {
          error: "email or password are requried",
        },
        { status: 400 }
      );
    }
    await User.create({
      email,
      password,
      role: "user",
    });
    return NextResponse.json(
      { message: "user register sucessfullly" },
      { status: 200 }
    );
  } catch (error) {
    console.log('registration error', error)
    return NextResponse.json(
        { message: "user register failed" },
        { status:501 }
      );
  }
}
