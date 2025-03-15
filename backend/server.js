import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); //allows you to parse the body of the request
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
