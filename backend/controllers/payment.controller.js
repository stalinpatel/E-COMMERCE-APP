import { createRazorpayInstance } from "../lib/razorpay.js";

import {
  applyCouponIfValid,
  createOrderInDB,
  getCartTotalWithLatestPrices,
  recordCouponUsage,
  verifySignature,
} from "../services/paymentServices.js";

const razorpayInstance = createRazorpayInstance();

// DONE
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    // console.log("Amount received in createOrder :", amount);

    const amountInPaise = Math.round(Number(amount) * 100);
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      // receipt: "test_receipt_1234",
      notes: {
        purpose: "E-commerce checkout",
      },
    };
    // console.log("amount :", amount);
    // console.log("Parsed amountInPaise:", amountInPaise);
    // console.log("Creating Razorpay order with:", options);

    const order = await razorpayInstance.orders.create(options);
    // console.log("Order is :", order);

    return res.status(200).json({ order, success: true });
    // return res
    //   .status(500)
    //   .json({ success: false, message: "Simulated order creation failure" });
  } catch (error) {
    console.log("Error in createOrder controller ", error);
    return res.status(500).json({ message: "Internal Server Error" + error });
  }
};

// DONE
export const verifyPayment = async (req, res) => {
  try {
    const {
      response: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
      orderDetails: { receiptId, amountInPaise },
      couponApplied: { code },
    } = req.body;

    const user = req.user;

    const isValid = verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );
    if (!isValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    const { cartWithPrice, expectedTotal } = await getCartTotalWithLatestPrices(
      user.cartItems
    );

    const { couponInfo, finalTotal, validCoupon } = await applyCouponIfValid(
      code,
      expectedTotal
    );

    if (Math.round(finalTotal * 100) !== amountInPaise) {
      return res.status(400).json({
        success: false,
        message: "Price mismatch. Please refresh and try again.",
      });
    }

    const order = await createOrderInDB({
      user: user._id,
      items: cartWithPrice,
      totalAmount: finalTotal,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paymentStatus: "successful",
      coupon: couponInfo,
      receiptId: receiptId,
    });

    if (validCoupon) await recordCouponUsage(user._id, couponInfo.couponId);

    return res.status(200).json({
      order: {
        orderId: order.razorpayOrderId,
        receiptId: order.receiptId,
        amount: order.totalAmount.toFixed(2),
        status: order.paymentStatus,
        paidAt: order.createdAt,
      },
      success: true,
      message: "Payment verified",
    });
  } catch (error) {
    console.log("Error in verifyPayment controller ", error);
    return res.status(500).json({ message: "Internal Server Error" + error });
  }
};
