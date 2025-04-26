import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  addToCart,
  removeAllFromCart,
  updateQuantity,
  getCartProducts,
  evaluateCartTotals,
  emptyCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", protectRoute, getCartProducts); // DONE
router.post("/", protectRoute, addToCart); // DONE
router.delete("/", protectRoute, removeAllFromCart); // DONE
router.put("/:id", protectRoute, updateQuantity); // DONE
router.post("/evaluate-totals", protectRoute, evaluateCartTotals); // DONE
router.patch("/empty-cart", protectRoute, emptyCart); // DONE
export default router;
