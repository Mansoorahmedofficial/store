import mongoose, { Schema, models, model } from "mongoose";
import { IMAGE_VARIANTS, imageVariantType } from "./Product";
interface PopulatedUser {
  _id: mongoose.Types.ObjectId;
  email: string;
}
interface PopulatedProduct {
  _id: mongoose.Types.ObjectId;
  email: string;
  imageUrl: string;
}

interface OrderINT {
  userId: mongoose.Types.ObjectId;
  Product: mongoose.Types.ObjectId;
  variants?: imageVariantType;
  razorpayOrderid: number | string;
  razorpayPaymentid: number | string;
  amount: number;
  status: string;
  downloadUrl: string;
  previewUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new Schema<OrderINT>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    Product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variants: {
      type: {
        type: String,
        required: true,
        enum: ["SQUARE", "WIDE", "PORTRAIT"] as imageVariantType[],
      },
      price: {
        type: Number,
        required: true,
      },
      license: {
        type: Number,
        required: true,
        enum: ["personal", "commercial"],
      },
    },
    razorpayOrderid: { type: String, required: true },
    razorpayPaymentid: { type: String, required: true },
    amount: { type: Number, requried: true },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    downloadUrl: { type: String },
    previewUrl: { type: String },
  },
  { timestamps: true }
);

const Orders = models?.Product || model<OrderINT>("Product", OrderSchema);

export default Orders;
