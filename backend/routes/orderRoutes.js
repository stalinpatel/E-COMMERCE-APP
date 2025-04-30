import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getAllOrders } from "../controllers/getAllOrders.controller.js";

const router = express.Router();

router.get("/", protectRoute, getAllOrders); // DONE

export default router;
