import mongoose from "mongoose";
import Product from "./product.model";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    Products: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    stripSessionId: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);


const Order = mongoose.model("Order", orderSchema);
export default Order;
