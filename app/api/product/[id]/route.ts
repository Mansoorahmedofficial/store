import { ConenctDatabase } from "@/lib/Db";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: String }> }
) {
  try {
    const { id } = await props.params;
    await ConenctDatabase();
    const product = await Product.findById(id).lean();
    if (!product) {
      return NextResponse.json({ error: "product not found" });
    }
    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "faild to fetch product" },
      { status: 200 }
    );
  }
}
