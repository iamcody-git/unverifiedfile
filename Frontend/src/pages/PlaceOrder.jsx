import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import esewa from "../assets/esewa.jpg";
import khalti from "../assets/khalti.png";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    getCartAmount,
    delivery_fee,
    products,
    setCartItem,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form fields
    if (Object.values(formData).some((field) => field.trim() === "")) {
      toast.error("Please fill in all required fields!");
      setLoading(false);
      return;
    }

    try {
      // Prepare order items
      const orderItems = [];
      for (const itemId in cartItems) {
        const quantity = cartItems[itemId];
        if (quantity > 0) {
          const product = products.find(
            (p) => String(p._id) === String(itemId)
          );
          if (product) {
            orderItems.push({ ...product, quantity });
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error("No items in the cart.");
        setLoading(false);
        return;
      }

      // Order data to send
      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        paymentMethod: method,
      };

      // Ensure user is logged in
      if (!token) {
        toast.error("Please login to place an order.");
        navigate("/Login");
        setLoading(false);
        return;
      }

      const authHeaders = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Khalti: server initiates ePayment, then user pays on Khalti (sandbox / production).
      // Docs: https://docs.khalti.com/khalti-epayment/
      if (method === "khalti") {
        const { paymentMethod: _pm, ...payload } = orderData;
        const response = await axios.post(
          `${backendUrl}/api/order/khalti/initiate`,
          { ...payload, paymentMethod: "Khalti" },
          { ...authHeaders, validateStatus: () => true }
        );

        if (response.data.success && response.data.payment_url) {
          window.location.href = response.data.payment_url;
          return;
        }

        toast.error(
          response.data.message ||
            (typeof response.data.detail === "string"
              ? response.data.detail
              : null) ||
            `Could not start Khalti (${response.status}). Check backend .env KHALTI_SECRET_KEY.`
        );
        setLoading(false);
        return;
      }

      // Cash on delivery (and other methods handled like COD for now)
      const response = await axios.post(
        `${backendUrl}/api/order/place`,
        orderData,
        authHeaders
      );

      if (response.data.success) {
        setCartItem({});
        toast.success("Order placed successfully!");
        navigate("/orders");
      } else {
        toast.error(response.data.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      const msg =
        error.response?.data?.message ||
        (error.code === "ERR_NETWORK"
          ? "Cannot reach server. Check VITE_BACKEND_URL and that the API is running."
          : null) ||
        error.message ||
        "Failed to place order. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row justify-between gap-8 pt-5 sm:pt-14 min-h-[80vh] border-t px-4"
    >
      {/* Delivery Information */}
      <div className="flex flex-col gap-6 sm:max-w-[480px]">
        <Title text1="Delivery" text2="INFORMATION" />
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            value={formData.firstName}
            name="firstName"
            type="text"
            placeholder="First Name"
            required
            className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            onChange={onChangeHandler}
            value={formData.lastName}
            name="lastName"
            type="text"
            placeholder="Last Name"
            required
            className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <input
          onChange={onChangeHandler}
          value={formData.email}
          name="email"
          type="email"
          placeholder="Email Address"
          required
          className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          onChange={onChangeHandler}
          value={formData.address}
          name="address"
          type="text"
          placeholder="Address"
          required
          className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            value={formData.city}
            name="city"
            type="text"
            placeholder="City"
            required
            className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            onChange={onChangeHandler}
            value={formData.state}
            name="state"
            type="text"
            placeholder="State"
            required
            className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <input
          onChange={onChangeHandler}
          value={formData.phone}
          name="phone"
          type="tel"
          placeholder="Phone Number"
          required
          className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Cart Total & Payment */}
      <div className="mt-8 w-full sm:w-1/2 lg:w-1/3">
        <CartTotal />

        <div className="mt-12">
          <Title text1="Payment" text2="METHOD" />
          <div className="flex flex-col lg:flex-row gap-4 mt-4">
            {[
              { id: "esewa", image: esewa, color: "green" },
              { id: "khalti", image: khalti, color: "purple" },
              { id: "cod", label: "Cash on Delivery", color: "gray" },
            ].map(({ id, image, label, color }) => (
              <div
                key={id}
                onClick={() => setMethod(id)}
                className={`flex items-center gap-3 border p-3 px-4 cursor-pointer rounded-lg hover:shadow-lg ${
                  method === id
                    ? `border-${color}-400 ring-2 ring-${color}-300`
                    : ""
                }`}
              >
                <div
                  className={`w-4 h-4 border rounded-full ${
                    method === id ? `bg-${color}-400` : ""
                  }`}
                />
                {image ? (
                  <div className="w-24 h-16 flex items-center justify-center border rounded-lg bg-white">
                    <img
                      className="h-10 w-auto object-contain"
                      src={image}
                      alt={id}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm font-medium mx-4">{label}</p>
                )}
              </div>
            ))}
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              disabled={loading}
              className={`bg-black text-white text-sm px-16 py-3 rounded-lg transition cursor-pointer ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
              }`}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
