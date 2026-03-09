import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItems = ({ id, image, name, price }) => {
  const { currency, addToCart, userId } = useContext(ShopContext);

  const handleAddToCart = (e) => {
    e.preventDefault(); // prevent Link navigation
    addToCart(id); // call context function
  };

  return (
    <div className="text-gray-700 cursor-pointer border p-2 rounded hover:shadow-md transition">
      <Link to={`/product/${id}`}>
        <div className="overflow-hidden">
          <img
            className="hover:scale-110 transition ease-in-out"
            src={image[0]}
            alt={name}
          />
        </div>
        <p className="pt-3 pb-1 text-sm">{name}</p>
        <p className="text-sm font-medium">{currency}{price}</p>
      </Link>
      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="mt-2 w-full bg-blue-500 text-white text-sm py-1 rounded hover:bg-blue-600 transition"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductItems;