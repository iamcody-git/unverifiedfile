import express from "express";
import {
  placeOrder,
  placeOrderEsewa,
  placeOrderKhalti,
  initiateKhaltiPayment,
  verifyKhaltiPayment,
  userOrders,
  allOrder,
  updateStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/Auth.js";

const orderRouter = express.Router();

// admin features
orderRouter.post("/list", adminAuth, allOrder);
orderRouter.post("/status", adminAuth, updateStatus);
orderRouter.delete("/remove/:id", adminAuth, deleteOrder);

// payment feature
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/khalti/initiate", authUser, initiateKhaltiPayment);
orderRouter.post("/khalti/verify", authUser, verifyKhaltiPayment);
orderRouter.post("/khalti", authUser, placeOrderKhalti);
orderRouter.post("/esewa", authUser, placeOrderEsewa);

//user feature
orderRouter.post("/userorders", authUser, userOrders);

export default orderRouter;
