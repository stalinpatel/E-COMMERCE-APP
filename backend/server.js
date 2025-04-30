import cookieParser from "cookie-parser";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { connectDB } from "./lib/db.js";
import analyticsRoutes from "./routes/analytics.route.js";
import authRoutes from "./routes/auth.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/payment.route.js";
import productRoutes from "./routes/product.route.js";
const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json()); //allows you to parse the body of the request
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/orders", orderRoutes);
app.get("/api/config/razorpay", (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});

// console.log("path :", __dirname);
// console.log("path :", path.join(__dirname, "/frontend/dist"));
// console.log("path :", path.join(__dirname, "../frontend/dist"));

app.use(express.static(path.join(__dirname, "../frontend/dist")));
// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"))
  );
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
