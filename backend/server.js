import express from "express";
import "dotenv/config";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import orderRoutes from "./routes/orderRoutes.js";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); //allows you to parse the body of the request
app.use(cookieParser());

app.use("/api/auth", authRoutes); // DONE
app.use("/api/products", productRoutes); // DONE 1left - productRecommendation
app.use("/api/cart", cartRoutes); // DONE
app.use("/api/coupons", couponRoutes); // DONE
app.use("/api/payments", paymentRoutes); // DONE
app.use("/api/analytics", analyticsRoutes); // DONE
app.use("/api/orders", orderRoutes); // DONE
app.listen(5000, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});

// TODO - ADD SORT FUNCTION IN COUPONS
// 1- SORT BY EXPIRY DATE
// 2- SORT BY DATE CREATED

// TOMORROW TODO-
// START WITH RAZORPAY INTEGRATION
//ADD ADDRESSES
//AFTER PAYMENT UPDATE THE COUPON USAGE DETAILS IN THE DATABASE TO PREVENT MULTIPLE TIME USES
