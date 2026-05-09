import mongoose from "mongoose";

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  throw new Error("URL is not available to connect DB.");
}

let cached = global.mongooseConn;
if (!cached) {
  cached = global.mongooseConn = {
    conn: null,
    promise: null,
  };
}

export default async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoURI as string).then((m) => m.connection);
  }

  try {
    let conn = await cached.promise;
    return conn;
  } catch (error) {
    console.log(error);
  }
}
