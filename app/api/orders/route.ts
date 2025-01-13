import { AuthOPtions } from "@/lib/auth";
import { ConenctDatabase } from "@/lib/Db";
import Orders from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
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
    const { productid, variant } = await req.json();
    await ConenctDatabase();

    const order = await razorpay.orders.create({
      amount: Math.round(variant.price * 100),
      currency: "USD",
      receipt: `recept_${Date.now()}`,
      notes: {
        productid: productid.toString(),
      },
    });
    const newOrder = await Orders.create({
      userId: session?.user.id,
      productid,
      variant,
      razorpayOrderid: order.id,
      amount: variant.price,
      status: "pending",
    });
    return NextResponse.json({
      orderid: order.id,
      amount: order.amount,
      currency: order.currency,
      dbOrderID: newOrder._id,
    });
  } catch (error) {
    console.log("error creating order", error);
    return NextResponse.json(
      { error: "failed to create order" },
      { status: 500 }
    );
  }
}
