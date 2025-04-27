import express from "express";
import { protectRoute, adminRoute } from "../middlewares/auth.middleware.js";
import {
  getAnalyticsData,
  getDailySalesData,
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();

    const endDate = new Date(); // Current date
    const startDate = new Date(endDate); // Copy of the endDate
    startDate.setDate(endDate.getDate() - 7); // Subtract 7 days from the current date
   
    const dailySalesData = await getDailySalesData(startDate, endDate);
    res.status(200).json({
      analyticsData,
      dailySalesData,
    });
  } catch (error) {
    console.log("Error in analytics route", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
