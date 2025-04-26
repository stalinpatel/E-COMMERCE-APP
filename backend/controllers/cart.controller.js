import Coupon from "../models/coupon.model.js";
import User from "../models/user.model.js";

// DONE
export const addToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find(
      (item) => item.productId.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push({ productId, quantity: 1 });
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in addToCart controller ", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error" + error.message });
  }
};

// DONE
export const removeAllFromCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    console.log("removeAllFromCart endpoint hit with productId:", productId);
    const user = req.user;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter(
        (item) => item.productId.toString() !== productId.toString()
      );
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in removeAllFromCart controller ", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error" + error.message });
  }
};

// DONE
export const updateQuantity = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find(
      (item) => item.productId.toString() === productId.toString()
    );
    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter(
          (item) => item.productId.toString() !== productId.toString()
        );
        await user.save();
        return res.json(user.cartItems);
      }
      existingItem.quantity = quantity;
      await user.save();
      return res.json(user.cartItems);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in updateQuantity controller ", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error" + error.message });
  }
};

// DONE
export const getCartProducts = async (req, res, next) => {
  try {
    const user = await req.user.populate("cartItems.productId");

    const cartItems = user.cartItems.map((item) => ({
      productId: item.productId._id,
      price: item.productId.price,
      description: item.productId.description,
      image: item.productId.image,
      category: item.productId.category,
      name: item.productId.name,
      isFeatured: item.productId.isFeatured,
      quantity: item.quantity,
    }));
    return res.status(200).json(cartItems);
  } catch (error) {
    console.log("Error in getCartProducts controller ", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error" + error.message });
  }
};

// DONE
export const evaluateCartTotals = async (req, res, next) => {
  try {
    const user = await req.user.populate("cartItems.productId");
    const { code } = req.body;

    let total = 0;
    let originalTotal = user.cartItems.reduce(
      (sum, item) =>
        sum + Number(item.quantity || 0) * Number(item?.productId?.price || 0),
      0
    );
    total = originalTotal;
    if (code) {
      const coupon = await Coupon.findOne({ code });

      if (coupon && coupon.isActive && coupon.expirationDate > Date.now()) {
        total -= total * (coupon.discountPercentage / 100);
      }
    }

    // Round all values to 2 decimal places
    total = parseFloat(total.toFixed(2));
    originalTotal = parseFloat(originalTotal.toFixed(2));
    const discount = parseFloat((originalTotal - total).toFixed(2));

    return res.status(200).json({
      total,
      originalTotal,
      discount,
    });
  } catch (error) {
    console.log("Error in evaluateCartTotals controller:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error: " + error.message });
  }
};

// DONE
export const emptyCart = async (req, res, next) => {
  try {
    const user = req.user;

    const updatedCart = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { cartItems: [] } },
      { new: true }
    );

    if (!updatedCart) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Cart Emptied", user: updatedCart });
  } catch (error) {
    console.log("Error in emptyCart controller:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error: " + error.message });
  }
};  
