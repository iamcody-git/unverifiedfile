import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// placing order using COD method
export const placeOrder = async (req, res) => {
  try {
    const userId = req.userId; // ← use middleware value
    const { items, amount, address } = req.body;

    console.log("Received Order Data:", { userId, items, amount, address });

    if (!items || items.length === 0) {
      return res.json({ success: false, message: "No items in the order" });
    }

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      status: "pending",
      date: Date.now(),
    };

    const newOrder = await orderModel.create(orderData);
    console.log("Order created:", newOrder);

    // clear user's cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed", order: newOrder });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Khalti payment
export const placeOrderKhalti = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, amount, address, paymentDetails } = req.body;

    if (!items || items.length === 0) {
      return res.json({ success: false, message: "No items in the order" });
    }

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Khalti",
      payment: true,
      paymentDetails,
      status: "completed",
      date: Date.now(),
    };

    const newOrder = await orderModel.create(orderData);
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed via Khalti", order: newOrder });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Esewa payment
export const placeOrderEsewa = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, amount, address, paymentDetails } = req.body;

    if (!items || items.length === 0) {
      return res.json({ success: false, message: "No items in the order" });
    }

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Esewa",
      payment: true,
      paymentDetails,
      status: "completed",
      date: Date.now(),
    };

    const newOrder = await orderModel.create(orderData);
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed via Esewa", order: newOrder });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// all orders for admin panel
export const allOrder = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// user orders for frontend
export const userOrders = async (req, res) => {
  try {
    const userId = req.userId; // ← use middleware value
    console.log("Fetching orders for userId:", userId);

    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    console.log("Orders found:", orders);

    if (orders.length === 0) {
      return res.json({
        success: true,
        message: "No orders found",
        orders: [],
      });
    }

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update order status from admin panel
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });

    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// delete completed/delivered order from admin panel
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await orderModel.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only allow deletion for completed/delivered orders
    if (order.status !== "Delivered" && order.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Only delivered/completed orders can be deleted",
      });
    }

    await orderModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};