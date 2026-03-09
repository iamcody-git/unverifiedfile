import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProduct from "../components/RelatedProduct";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");

  useEffect(() => {
    const product = products.find((p) => p._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  }, [productId, products]);

  if (!productData) return <div className="opacity-0"></div>;

  return (
    <div className="border-t-2 pt-10">
      <div className="flex flex-col sm:flex-row gap-12">
        {/* Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="Product"
                className="w-[24%] sm:w-full sm:mb-3 cursor-pointer"
                onClick={() => setImage(img)}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} alt="Product" className="w-full h-auto" />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-medium mt-2">{productData.name}</h1>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-600 leading-relaxed text-justify">
            {productData.description}
          </p>

          <button
            onClick={() => addToCart(productData._id)}
            className="bg-black text-white mt-8 px-8 py-3 text-sm"
          >
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Related products */}
      <RelatedProduct
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;
