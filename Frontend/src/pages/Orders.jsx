import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrderData = async () => {
    try {
      if (!token) {
        toast.error("No token found. Cannot fetch user orders.");
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const allOrdersItem = response.data.orders.flatMap((order) => {
          if (order.items && Array.isArray(order.items)) {
            return order.items.map((item) => ({
              ...item,
              orderId: order._id,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            }));
          }
          return [];
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error("Error loading order data:", error);
      toast.error("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const trackOrderStatus = async (orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const allOrdersItem = response.data.orders.flatMap((order) => {
          if (order.items && Array.isArray(order.items)) {
            return order.items.map((item) => ({
              ...item,
              orderId: order._id,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            }));
          }
          return [];
        });

        setOrderData(allOrdersItem.reverse());

        const updatedOrder = response.data.orders.find(
          (order) => order._id === orderId
        );
        if (updatedOrder) {
          toast.success(`Order status: ${updatedOrder.status}`);
        }
      }
    } catch (error) {
      toast.error("Failed to track order status.");
    }
  };

  useEffect(() => {
    if (!token) return;

    // Initial load
    loadOrderData();

    // Auto-refresh orders every 10 seconds
    const intervalId = setInterval(() => {
      loadOrderData();
    }, 10000);

    // Cleanup on unmount or token change
    return () => clearInterval(intervalId);
  }, [token]);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"My"} text2={"ORDERS"} />
      </div>
      <div>
        {orderData.length === 0 ? (
          <p>No orders found. Please check back later.</p>
        ) : (
          orderData.map((item) => (
            <div
              key={item._id}
              className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-start gap-6 text-sm">
                <img
                  src={item.image && item.image[0] ? item.image[0] : "default_image_url"}
                  alt={item.name}
                  className="-16 sm:w-20"
                />
                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>
                  <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                    <p>
                      {currency || "$"}
                      {item.price}
                    </p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <p className="mt-2">
                    Date: <span className="text-gray-400">{new Date(item.date).toDateString()}</span>
                  </p>
                  <p className="mt-2">
                    Payment: <span className="text-gray-400">{item.paymentMethod}</span>
                  </p>
                </div>
              </div>
              <div className="ms:w-1/2 flex justify-between">
                <div className="flex items-center gap-2">
                  <p className="min-w h-2 rounded-full bg-green-500"></p>
                  <p className="text-sm md:text-base">{item.status}</p>
                </div>
              </div>
              <button
                onClick={() => trackOrderStatus(item.orderId)}
                className="border px-4 py-2 text-sm font-medium rounded-sm cursor-pointer"
              >
                Track Order
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
