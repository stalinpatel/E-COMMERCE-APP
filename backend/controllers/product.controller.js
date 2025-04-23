import { redish } from "../lib/redish.js";
import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";
import fs from "fs";

const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Deleted:", result);
  } catch {
    console.error("Error deleting image:", error);
  }
};

const safeUnlink = (path) => {
  try {
    fs.unlinkSync(path);
  } catch (err) {
    console.warn("File deletion failed:", err.message);
  }
};

// DONE
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller ", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error" + error.message });
  }
};

// DONE
export const featuredProducts = async (req, res, next) => {
  try {
    const featuredProducts = await redish.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }
    // IF NOT IN REDISH , FETCH FROM MONGODB
    // LEAN() - will return a plain js object instead of mongodb document which is good  for performance
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    console.log("featuredProducts", featuredProducts);
    if (!featuredProducts) {
      return res.status(404).json({ message: "No feature products found" });
    }

    // STORE IN REDISH FOR FUTURE QUICK ACCESS
    await redish.set("featured_products", JSON.stringify(featuredProducts));

    return res.json(featuredProducts);
  } catch (error) {
    console.log("Error in featuredProducts controller ", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error" + error.message });
  }
};

// DONE
export const createProduct = async (req, res, next) => {
  console.log("CreateProduct endpoint hitted");

  try {
    const { name, description, price, category, stock } = req.body;
    const localPath = req.file?.path;
    console.log("file isss:", req.file);
    let cloudinaryResponse = null;
    if (localPath) {
      cloudinaryResponse = await cloudinary.uploader.upload(localPath, {
        folder: "products",
      });
    }
    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse?.secure_url
        : "",
      publicId: cloudinaryResponse.public_id,
    });

    safeUnlink(localPath);
    res.status(201).json(product);
  } catch (error) {
    console.log("Error in createProduct controller ", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error" + error.message });
  }
};

// DONE
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.publicId) {
      await deleteImage(product.publicId);
    }

    await Product.findByIdAndDelete(req.params.id);
    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct controller ", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error" + error.message });
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          description: 1,
          image: 1,
        },
      },
    ]);
    res.json(products);
  } catch (error) {
    console.log("Error in getRecommendations controller ", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error" + error.message });
  }
};

// DONE
export const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    console.log("Error in getProductsByCategory controller ", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error" + error.message });
  }
};

// DONE
export const toggleFeaturedProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductCache();
      return res.json({ updatedProduct, message: "Toggled successfully" });
    } else {
      return res.json({ message: "No product found" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller ", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error " + error.message });
  }
};

async function updateFeaturedProductCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redish.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log(
      "Error in updateFeaturedProductCache controller ",
      error.message
    );
  }
}
