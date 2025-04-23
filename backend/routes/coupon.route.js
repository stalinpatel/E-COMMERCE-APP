import express from "express";
import { protectRoute, adminRoute } from "../middlewares/auth.middleware.js";
import {
  getAllCoupons,
  validateCoupon,
  createCoupon,
  editCoupon,
  deleteCoupon,
  toggleActiveStatus,
} from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protectRoute, getAllCoupons); //DONE
router.post("/", adminRoute, createCoupon); //DONE
router.delete("/:id", adminRoute, deleteCoupon); //DONE
router.patch("/:id", adminRoute, editCoupon); //DONE
router.patch("/toggle-status/:id", adminRoute, toggleActiveStatus); //DONE
router.post("/validate", protectRoute, validateCoupon);

export default router;
