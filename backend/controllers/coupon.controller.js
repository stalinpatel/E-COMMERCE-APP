import Coupon from "../models/coupon.model.js";
import formatDate from "../lib/formatDate.js";

//DONE
export const getAllCoupons = async (req, res, next) => {
  try {
    // Check if the user is an admin or regular user
    let coupons;
    if (req.user && req.user.role === "admin") {
      // Admin: get all coupons
      coupons = await Coupon.find({});
    } else {
      // Regular user: get only active coupons that are not expired
      coupons = await Coupon.find({
        expirationDate: { $gte: new Date() },
        isActive: true,
      });
    }
    if (coupons) {
      const formattedCoupons = coupons.map((coupon) => ({
        ...coupon.toObject(),
        expirationDate: formatDate(coupon.expirationDate),
      }));
      res.status(200).json(formattedCoupons);
    }
  } catch (error) {
    console.log("Error in getAllCoupon controller ", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error" + error.message });
  }
};

//DONE
export const createCoupon = async (req, res, next) => {
  try {
    const { code, expirationDate, discountPercentage } = req.body;

    if (!code || !expirationDate || !discountPercentage) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const coupon = await Coupon.create({
      code,
      expirationDate: new Date(expirationDate),
      discountPercentage: Number(discountPercentage),
    });
    if (coupon) {
      const formattedCoupon = {
        ...coupon.toObject(),
        expirationDate: formatDate(coupon.expirationDate),
      };
      res.status(200).json(formattedCoupon);
    }
  } catch (error) {
    console.log("Error in createCoupon controller ", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error" + error.message });
  }
};

//DONE
export const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Coupon.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    console.log("Error in deleteCoupon controller ", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error" + error.message });
  }
};

//DONE
export const editCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const newData = req.body;
    const coupon = await Coupon.findByIdAndUpdate(
      id,
      { $set: newData },
      { new: true, runValidators: true }
    );
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    const formattedCoupon = {
      ...coupon.toObject(),
      expirationDate: formatDate(coupon.expirationDate),
    };
    res.status(200).json(formattedCoupon);
  } catch (error) {
    console.log("Error in editCoupon controller ", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error" + error.message });
  }
};

export const validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code: code,
      isActive: true,
    });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found or inactive" });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(404).json({ message: "Coupon expired" });
    }

    return res.status(200).json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      isVerified: true,
    });
  } catch (error) {
    console.log("Error in validateCoupon controller ", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error" + error.message });
  }
};

export const toggleActiveStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    coupon.isActive = !coupon.isActive;
    const updatedCoupon = await coupon.save();

    res.status(200).json({
      ...updatedCoupon.toObject(),
      expirationDate: formatDate(updatedCoupon.expirationDate),
    });
  } catch (error) {
    console.log("Error in toggleActiveStatus controller", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error" + error.message });
  }
};
