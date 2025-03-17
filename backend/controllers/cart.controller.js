import User from "../models/user.model";

export const addToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find(
      (item) => item.product.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push({ product: productId, quantity: 1 });
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
