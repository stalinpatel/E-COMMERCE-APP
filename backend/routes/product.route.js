import express from "express";
import { protectRoute, adminRoute } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
  getAllProducts,
  featuredProducts,
  createProduct,
  deleteProduct,
  getRecommendations,
  getProductsByCategory,
  toggleFeaturedProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts); // DONE
router.post(
  "/",
  protectRoute,
  adminRoute,
  upload.single("image"),
  createProduct
); // DONE
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct); // DONE
router.delete("/:id", protectRoute, adminRoute, deleteProduct); // DONE

router.get("/recommendations", getRecommendations);
router.get("/featured", featuredProducts); // DONE
router.get("/category/:category", getProductsByCategory); // DONE

export default router;
