import mongoose from "mongoose";
import "dotenv/config";
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

export const connectDB = async () => {
  console.log(`hello :${MONGO_URI}/${DB_NAME}`);
  try {
    const conn = await mongoose.connect(`${MONGO_URI}/${DB_NAME}`);
    console.log(`mongodb connected :${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting MONGODB ", error);
    process.exit(1);
  }
};
