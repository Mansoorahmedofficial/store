import mongoose, { Schema, models, model } from "mongoose";
import bcrypt from "bcryptjs";


export interface UserInter {
  email: string;
  password: string;
  Role: "user" | "admin";
  _id?: mongoose.Types.ObjectId
  creatAt?: Date, 
  updateAt?:Date
}

const UserSchema = new Schema<UserInter>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    Role: { type: String, enum: ["user", "admin"], default: "user" },

  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

const User = models?.User || model<UserInter>("User", UserSchema);

export default User;
