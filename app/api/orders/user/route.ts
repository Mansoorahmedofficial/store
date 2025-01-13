import { AuthOPtions } from "@/lib/auth";
import { ConenctDatabase } from "@/lib/Db";
import Orders from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import orders from "razorpay/dist/types/orders";

export async function GET() {
  try {
    const session = await getServerSession(AuthOPtions);
    if (!session) {
      return NextResponse.json(
        {
          error: "Unauthorized access",
        },
        {
          status: 401,
        }
      );
    }

    await ConenctDatabase();
    await Orders.find({ userId: session?.user.id })
      .populate({
        path: "productid",
        select: "name imageUrl",
        options: { strictPopulate: false },
      })
      .sort({ createAt: -1 })
      .lean();

    return NextResponse.json({ orders }, { status: 201 });
  } catch (error) {}
}
