import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ConenctDatabase } from "@/lib/Db";
import Orders from "@/models/Order";
import nodemailer from "nodemailer";
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const expectedsignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");
    if (expectedsignature !== signature) {
      return NextResponse.json(
        { error: "invalide signature" },
        { status: 400 }
      );
    }
    const event = JSON.parse(body);
    await ConenctDatabase();
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const order = await Orders.findOneAndUpdate(
        {
          razarpayPaymentid: payment.id,
        },
        {
          razorpayPaymentId: payment.id,
          status: "complated",
        }
      ).populate([
        { path: "producid", select: "name" },
        { path: "userid", select: "email" },
      ]);
      if (order) {
        const transporter = nodemailer.createTransport({
          service: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "ad325e00f5b23f",
            pass: "4d652f03562025",
          },
        });
        await transporter.sendMail({
          from: "your@gmail.com",
          to: order.userId.email,
          subject: "Order completed",
          text: `Your order ${order.productid.name} has been successfully placed`,
        });
      }
    }
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error }, { status: 501 });
  }
}
