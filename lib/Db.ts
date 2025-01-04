import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URL!;

if (!MONGODB_URI) {
  throw new Error("check for database connection");
}
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { con: null, promise: null };
}

export async function ConenctDatabase() {
  if (cached.con) {
    return cached.con;
  }
  if (!cached.promise) {
    const options = {
      bufferCommands: true,
      maxPoolSize: 10,
    };
    cached.promise = mongoose.connect(MONGODB_URI, options)
    .then(
        ()=> mongoose.connection
    )
  }
  try{
   cached.con = await cached.promise
  }
  catch(error){
    cached.promise = null
  console.log('error while connecting with data', error)
  }
  return cached.con
}
