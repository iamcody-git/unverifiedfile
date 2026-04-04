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

// --- Khalti ePayment (KPG-2) — sandbox: https://docs.khalti.com/khalti-epayment/ ---
const getKhaltiBaseUrl = () =>
  (process.env.KHALTI_API_URL || "https://dev.khalti.com/api/v2").replace(
    /\/$/,
    ""
  );

/** Khalti expects amount in paisa (Rs 10 = 1000 paisa per docs). */
const nprToPaisa = (npr) => Math.round(Number(npr) * 100);

export const initiateKhaltiPayment = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, amount, address } = req.body;

    if (!items || items.length === 0) {
      return res.json({ success: false, message: "No items in the order" });
    }

    const secret = String(process.env.KHALTI_SECRET_KEY || "").trim();
    const frontendUrl = (
      process.env.FRONTEND_URL || "http://localhost:5173"
    ).replace(/\/$/, "");

    if (!secret) {
      return res.status(500).json({
        success: false,
        message:
          "Khalti is not configured: add KHALTI_SECRET_KEY to Backend/.env (sandbox secret from https://test-admin.khalti.com — same as “Live secret key” in test dashboard). Restart the server after saving.",
      });
    }

    const amountPaisa = nprToPaisa(amount);
    if (amountPaisa < 1000) {
      return res.json({
        success: false,
        message: "Khalti minimum amount is Rs. 10 (1000 paisa).",
      });
    }

    const order = await orderModel.create({
      userId,
      items,
      amount,
      address,
      paymentMethod: "Khalti",
      payment: false,
      status: "Khalti Pending",
      date: Date.now(),
    });

    const purchaseOrderId = order._id.toString();
    const payload = {
      return_url: `${frontendUrl}/payment/khalti-return`,
      website_url: frontendUrl,
      amount: amountPaisa,
      purchase_order_id: purchaseOrderId,
      purchase_order_name:
        items.length === 1
          ? String(items[0].name || "Order").slice(0, 120)
          : `Order (${items.length} items)`,
      customer_info: {
        name: `${address.firstName || ""} ${address.lastName || ""}`.trim(),
        email: address.email,
        phone:
          String(address.phone || "")
            .replace(/\D/g, "")
            .slice(0, 15) || "9800000001",
      },
    };

    const khaltiUrl = `${getKhaltiBaseUrl()}/epayment/initiate/`;

    const callKhaltiInitiate = (authPrefix) =>
      fetch(khaltiUrl, {
        method: "POST",
        headers: {
          Authorization: `${authPrefix} ${secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

    // Docs show both "Key" and "key" — try Key first, then key on 401
    let khaltiRes = await callKhaltiInitiate("Key");
    if (khaltiRes.status === 401) {
      khaltiRes = await callKhaltiInitiate("key");
    }

    const rawText = await khaltiRes.text();
    let data;
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      await orderModel.findByIdAndDelete(order._id);
      return res.json({
        success: false,
        message:
          "Invalid response from Khalti. Check KHALTI_API_URL and your network.",
        raw: String(rawText).slice(0, 200),
      });
    }

    if (!khaltiRes.ok || !data.payment_url) {
      await orderModel.findByIdAndDelete(order._id);
      const detail =
        typeof data.detail === "string"
          ? data.detail
          : data.detail
            ? JSON.stringify(data.detail)
            : "";
      const msg =
        detail ||
        (Array.isArray(data.return_url) && data.return_url[0]) ||
        (Array.isArray(data.amount) && data.amount[0]) ||
        data.error_key ||
        `Khalti error (${khaltiRes.status})`;
      return res.json({ success: false, message: msg, khalti: data });
    }

    await orderModel.findByIdAndUpdate(order._id, {
      khaltiPidx: data.pidx,
    });

    return res.json({
      success: true,
      payment_url: data.payment_url,
      pidx: data.pidx,
      orderId: purchaseOrderId,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const verifyKhaltiPayment = async (req, res) => {
  try {
    const userId = String(req.userId);
    const { pidx, orderId } = req.body;

    if (!pidx || !orderId) {
      return res.json({
        success: false,
        message: "pidx and orderId are required",
      });
    }

    const secret = String(process.env.KHALTI_SECRET_KEY || "").trim();
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "Khalti is not configured (KHALTI_SECRET_KEY missing).",
      });
    }

    const order = await orderModel.findById(orderId);
    if (!order || String(order.userId) !== userId) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (order.payment) {
      return res.json({
        success: true,
        message: "Order already confirmed",
        order,
      });
    }

    const lookupUrl = `${getKhaltiBaseUrl()}/epayment/lookup/`;
    const callLookup = (prefix) =>
      fetch(lookupUrl, {
        method: "POST",
        headers: {
          Authorization: `${prefix} ${secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pidx }),
      });

    let lookupRes = await callLookup("Key");
    if (lookupRes.status === 401) {
      lookupRes = await callLookup("key");
    }

    const lookupRaw = await lookupRes.text();
    let lookup;
    try {
      lookup = lookupRaw ? JSON.parse(lookupRaw) : {};
    } catch {
      return res.json({
        success: false,
        message: "Invalid Khalti lookup response",
      });
    }

    if (!lookupRes.ok || lookup.status !== "Completed") {
      return res.json({
        success: false,
        message: lookup.status || "Payment not completed",
        lookup,
      });
    }

    const expectedPaisa = nprToPaisa(order.amount);
    if (Number(lookup.total_amount) !== expectedPaisa) {
      return res.json({
        success: false,
        message: "Amount mismatch with order",
        lookup,
      });
    }

    await orderModel.findByIdAndUpdate(orderId, {
      payment: true,
      status: "completed",
      paymentDetails: {
        pidx,
        transaction_id: lookup.transaction_id,
        fee: lookup.fee,
        lookup,
      },
    });

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const updated = await orderModel.findById(orderId);
    return res.json({
      success: true,
      message: "Payment verified",
      order: updated,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};