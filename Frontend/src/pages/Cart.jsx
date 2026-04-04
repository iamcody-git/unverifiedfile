import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, removeItemFromCart, navigate } =
    useContext(ShopContext);
  const [CartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const id in cartItems) {
      if (cartItems[id] > 0) {
        tempData.push({
          _id: id,
          quantity: cartItems[id],
        });
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  const visibleLines = CartData.filter((item) => {
    const product = products.find(
      (p) => String(p._id) === String(item._id)
    );
    return Boolean(product);
  });

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1="Your" text2="CART" />
      </div>

      {CartData.length === 0 ? (
        <p className="text-gray-500 py-10">No items in your cart.</p>
      ) : visibleLines.length === 0 && products.length === 0 ? (
        <p className="text-gray-500 py-10">Loading cart…</p>
      ) : visibleLines.length === 0 ? (
        <p className="text-gray-500 py-10">
          Some cart items are no longer available. Try adding products again.
        </p>
      ) : null}

      {CartData.map((item, idx) => {
        const product = products.find(
          (p) => String(p._id) === String(item._id)
        );
        if (!product) return null;

        return (
          <div
            key={idx}
            className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
          >
            <div className="flex items-start gap-6">
              <img src={product.image[0]} className="w-16 sm:w-20" alt={product.name} />
              <div>
                <p className="text-xs sm:text-lg font-medium">{product.name}</p>
                <p>Quantity: {item.quantity}</p>
                <p className="mt-2">
                  {currency}
                  {product.price}
                </p>
              </div>
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              className="border max-w-10 px-1 sm:px-1 py-1"
              onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
            />
            <img
              onClick={() => removeItemFromCart(item._id)}
              src={assets.bin_icon}
              alt=""
              className="w-4 mr-4 sm:w-5 cursor-pointer"
            />
          </div>
        );
      })}

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end mt-0">
            <button
              onClick={() => navigate("/place-orders")}
              className="bg-black text-white text-sm my-8 px-4 py-3 cursor-pointer"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
