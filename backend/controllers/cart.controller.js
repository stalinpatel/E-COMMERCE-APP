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
export const removeAllFromCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
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
      res.status(404).json({ message: "Product not found" });
    }

    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in updateQuantity controller ", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error" + error.message });
  }
};
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
    return res.json(cartItems);
  } catch (error) {
    console.log("Error in getCartProducts controller ", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error" + error.message });
  }
};
