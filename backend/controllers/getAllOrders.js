import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
export const getAllOrders = async (req, res) => {
  try {
    const user = req.user;
    const orders = await Order.aggregate([
      {
        $match: { user: user._id },
      },
      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: Product.collection.name,
          localField: "items.productId",
          foreignField: "_id",
          as: "items.productInfo",
        },
      },
      {
        $unwind: "$items.productInfo",
      },
      {
        $project: {
          _id: 0,
          user: 1,
          items: 1,
          totalAmount: 1,
          paymentStatus: 1,
          coupon: 1,
          receiptId: 1,
          createdAt: 1,
          razorpayPaymentId: 1,
          items: {
            quantity: "$items.quantity",
            price: "$items.price",
            name: "$items.productInfo.name",
            image: "$items.productInfo.image",
          },
        },
      },
      {
        $group: {
          _id: "$receiptId",
          user: { $first: "$user" },
          totalAmount: { $first: "$totalAmount" },
          paymentStatus: { $first: "$paymentStatus" },
          coupon: { $first: "$coupon" },
          razorpayPaymentId: { $first: "$razorpayPaymentId" },
          createdAt: { $first: "$createdAt" },
          receiptId: { $first: "$receiptId" },
          items: { $push: "$items" },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    if (orders.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No orders found" });
    }
    return res
      .status(200)
      .json({ orders, success: true, message: "Orders fetched successfully" });
  } catch (error) {
    console.log("Error in orders controller", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
