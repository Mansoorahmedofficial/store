import { timeStamp } from "console";
import mongoose, { Schema, models, model } from "mongoose";

export const IMAGE_VARIANTS = {
    SQUARE: {
      type: "SQUARE",
      dimensions: { width: 1200, height: 1200 },
      label: "Square (1:1)",
      aspectRatio: "1:1",
    },
    WIDE: {
      type: "WIDE",
      dimensions: { width: 1920, height: 1080 },
      label: "Widescreen (16:9)",
      aspectRatio: "16:9",
    },
    PORTRAIT: {
      type: "PORTRAIT",
      dimensions: { width: 1080, height: 1440 },
      label: "Portrait (3:4)",
      aspectRatio: "3:4",
    },
  } as const;

 export type imageVariantType = keyof typeof IMAGE_VARIANTS;
interface ImageVarianINT{
  type:imageVariantType, 
  price:number, 
  license:"personal" | "commercial",

}
export interface ProductInt{
    id?:mongoose.Types.ObjectId
    name:string, 
    discription:string, 
    imageUrl:string, 
    variants:ImageVarianINT[],
}

const iamgeVariationSChema = new Schema<ImageVarianINT>({
  type: {
    type: String,
    required: true,
    enum: ["SQUARE", "WIDE", "PORTRAIT"],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  license: {
    type: String,
    required: true,
    enum: ["personal", "commercial"],
  },
});

const productShema = new Schema<ProductInt>(
  {
    name: { type: String, required: true },
    discription: { type: String, required: true },
    imageUrl: { type: String, required: true },
    variants: [iamgeVariationSChema],
  },
  { timestamps: true }
);

const Product = models?.Product || model<ProductInt>("Product", productShema);

export default Product;
