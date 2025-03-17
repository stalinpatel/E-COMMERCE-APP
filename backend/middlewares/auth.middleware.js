import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No access token provided" });
    }
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user = user;
      return next();
    } catch (error) {
      if (error.name == "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Unauthorized - access token expired" });
      }
      throw error;
    }
  } catch (error) {
    console.log("Error in protectRoute middleware ", error.message);
    res.status(500).json({ message: "Internal server error" + error.message });
  }
};

export const adminRoute = async (req, res, next) => {
  if (req.user && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied - Admin only" });
  }
  return next();
};
