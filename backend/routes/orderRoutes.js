import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getAllOrders } from "../controllers/getAllOrders.js";

const router = express.Router();

router.get("/", protectRoute, getAllOrders);

export default router;
