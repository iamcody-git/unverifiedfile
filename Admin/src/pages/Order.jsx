import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const deleteOrder = async (orderId, status) => {
    if (status !== "Delivered" && status !== "completed") {
      toast.error("Only delivered/completed orders can be deleted.");
      return;
    }

    try {
      const response = await axios.delete(
        `${backendUrl}/api/order/remove/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Order deleted successfully");
        fetchAllOrders();
      } else {
        toast.error(response.data.message || "Failed to delete order");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {orders.map((order, index) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 text-xs sm:text-sm text-gray-600"
            key={index}
          >
            <img className="w-12" src={assets.parcel_icon} alt="" />
            <div>
              <div>
                {order.items.map((item, idx) => {
                  const itemName = item.name || "Item name not available";
                  return (
                    <p className="py-0.5" key={idx}>
                      {itemName} x {item.quantity}
                    </p>
                  );
                })}
              </div>
              <p className="mt-3 mb-2 font-medium">
                {order.address.firstName} {order.address.lastName}
              </p>
              <div>
                <p>{order.address.email},</p>
                <p>
                  {order.address.city}, {order.address.state}
                </p>
                <p>{order.address.phone}</p>
              </div>
            </div>
            <div>
              <p className="text-sm sm:text-[15px]">Item: {order.items.length}</p>
              <p className="mt-3">Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? "Done" : "Pending"}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className="text-sm sm:text-[15px]">
              {currency}
              {order.amount}
            </p>
            <div className="flex flex-col gap-2">
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className="p-2 font-semibold"
              >
                <option value="OrderPlaced">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
              <button
                onClick={() => deleteOrder(order._id, order.status)}
                className={`px-3 py-1 rounded text-xs font-semibold border ${
                  order.status === "Delivered" || order.status === "completed"
                    ? "border-red-500 text-red-500 hover:bg-red-50"
                    : "border-gray-300 text-gray-400 cursor-not-allowed"
                }`}
                disabled={
                  order.status !== "Delivered" && order.status !== "completed"
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
