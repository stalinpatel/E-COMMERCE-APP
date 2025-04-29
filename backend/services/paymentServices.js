import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Coupon from "../models/coupon.model.js";
import CouponUsage from "../models/couponUsage.model.js";
import crypto from "crypto";

const secret = process.env.RAZORPAY_KEY_SECRET;

export const verifySignature = (orderId, paymentId, signature) => {
  try {
    const body = `${orderId}|${paymentId}`;
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(body);
    const expectedSignature = hmac.digest("hex");
    return expectedSignature === signature;
  } catch (error) {
    console.error("Error verifying signature:", error);
    throw new Error("Failed to verify Razorpay signature.");
  }
};

export const getCartTotalWithLatestPrices = async (cartItems) => {
  try {
    const cartWithPrice = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item.productId).select("price");
        if (!product) {
          console.warn(`Missing product: ${item.productId}`);
          return null;
        }
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        };
      })
    );
    const expectedTotal = cartWithPrice.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
    return { cartWithPrice, expectedTotal };
  } catch (error) {
    console.error("Error getting cart total with latest prices:", error);
    throw new Error("Failed to calculate cart total.");
  }
};

export const applyCouponIfValid = async (code, expectedTotal) => {
  try {
    const validCoupon = code
      ? await Coupon.findOne({ code, isActive: true })
      : null;

    const discPercent = validCoupon?.discountPercentage || 0;

    const couponInfo = validCoupon
      ? {
          couponId: validCoupon._id,
          code: validCoupon.code,
          discountPercentage: discPercent,
        }
      : null;
    const discount = validCoupon
      ? expectedTotal * couponInfo.discountPercentage * 0.01
      : 0;
    const finalTotal = validCoupon ? expectedTotal - discount : expectedTotal;
    return { couponInfo, finalTotal, validCoupon };
  } catch (error) {
    console.error("Error applying coupon:", error);
    throw new Error("Failed to apply coupon.");
  }
};

export const createOrderInDB = async (orderData) => {
  try {
    return await Order.create(orderData);
  } catch (error) {
    console.error("Error creating order in DB:", error);
    throw new Error("Failed to create order in database.");
  }
};

export const recordCouponUsage = async (userId, couponId) => {
  try {
    await CouponUsage.create({ userId, couponId });
    return;
  } catch (error) {
    console.error("Error recording coupon usage:", error);
    throw new Error("Failed to record coupon usage.");
  }
};
