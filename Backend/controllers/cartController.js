import userModel from "../models/userModel.js";

// Add item to cart
export const addToCart = async (req, res) => {
  try {

    const userId = req.userId;
    const { itemId } = req.body;

    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let cartData = userData.cartData || {};

    cartData[itemId] = (cartData[itemId] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({
      success: true,
      message: "Item added to cart",
      cartData,
    });

  } catch (error) {

    console.error("Add to cart error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Update cart quantity
export const updateCart = async (req, res) => {
  try {

    const userId = req.userId;
    const { itemId, quantity } = req.body;

    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let cartData = userData.cartData || {};

    if (quantity < 1) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({
      success: true,
      message: "Cart updated",
      cartData,
    });

  } catch (error) {

    console.error("Update cart error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {

    const userId = req.userId;
    const { itemId } = req.body;

    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let cartData = userData.cartData || {};

    delete cartData[itemId];

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({
      success: true,
      message: "Item removed",
      cartData,
    });

  } catch (error) {

    console.error("Remove from cart error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get user cart
export const getUserCart = async (req, res) => {
  try {

    const userId = req.userId;

    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cartData = userData.cartData || {};

    res.json({
      success: true,
      cartData,
    });

  } catch (error) {

    console.error("Get cart error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};