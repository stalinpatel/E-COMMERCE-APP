import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  addToCart,
  removeAllFromCart,
  updateQuantity,
  getCartProducts,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", protectRoute, getCartProducts); // DONE
router.post("/", protectRoute, addToCart); // DONE
router.delete("/", protectRoute, removeAllFromCart); // DONE
router.put("/:id", protectRoute, updateQuantity); // DONE
export default router;
