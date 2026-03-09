import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);

  // Fetch all products
  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Remove product
  const removeProduct = async (id) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/product/remove/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Product removed successfully");
        fetchList(); // Refresh after deletion
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error removing product:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-3 text-lg font-semibold">Product List</p>

      <div className="flex flex-col gap-2">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] items-center py-2 px-3 border bg-gray-100 text-sm font-medium">
          <b>Image</b>
          <b>Name</b>
          <b>Brand</b>
          <b>Type</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* Product Rows */}
        {list.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] items-center gap-2 py-2 px-3 border text-sm"
          >
            <img
              className="w-12 h-12 object-cover rounded"
              src={item.image[0]}
              alt={item.name}
            />
            <p className="truncate">{item.name}</p>
            <p className="capitalize">{item.brand}</p>
            <p className="capitalize">{item.type}</p>
            <p>
              {currency}
              {item.price}
            </p>
            <button
              onClick={() => removeProduct(item._id)}
              className="text-red-500 font-bold text-lg text-center hover:text-red-700 transition"
            >
              ✕
            </button>
          </div>
        ))}

        {list.length === 0 && (
          <p className="text-gray-500 mt-3 text-sm text-center">
            No products available.
          </p>
        )}
      </div>
    </>
  );
};

export default List;
