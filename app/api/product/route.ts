import { AuthOPtions } from "@/lib/auth";
import { ConenctDatabase } from "@/lib/Db";
import Product, { ProductInt } from "@/models/Product";
import { error } from "console";
import NextAuth, { getServerSession } from "next-auth";

import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const dataConntion = await ConenctDatabase();
    const product = await Product.find({}).lean();
    if (!product || product.length === 0) {
      return NextResponse.json({ error: "no product found" }, { status: 400 });
    }
    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "something went wrong " });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(AuthOPtions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthrorized access" },
        { status: 401 }
      );
    }
    await ConenctDatabase();
    const body: ProductInt = await request.json();
    if (
      !body.name ||
      !body.discription ||
      !body.imageUrl ||
      body.variants.length === 0
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    const newProduct = await Product.create(body);
    return NextResponse.json({ newProduct }, { status: 200 });
  } catch (error) {
    console.log("error while doing post requist", error);
    
  }
}
