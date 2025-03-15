import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redish = new Redis(process.env.UPSTASH_REDISH_URL);
