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

router.get("/", protectRoute, adminRoute, getAllProducts);
router.post(
  "/",
  protectRoute,
  adminRoute,
  upload.single("image"),
  createProduct
);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

router.get("/recommendations", getRecommendations);
router.get("/featured", featuredProducts);
router.get("/category/:category", getProductsByCategory);

export default router;
