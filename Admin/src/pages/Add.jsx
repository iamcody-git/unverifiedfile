import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("skincare");
  const [brand, setBrand] = useState("uvdoux");
  const [bestseller, setBestseller] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image1 && !image2 && !image3 && !image4) {
      toast.error("Please upload at least one image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("type", type);
      formData.append("brand", brand);
      formData.append("bestseller", bestseller);

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setPrice("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setType("skincare");
        setBrand("uvdoux");
        setBestseller(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          {[setImage1, setImage2, setImage3, setImage4].map((setImage, i) => (
            <label key={i} htmlFor={`image${i + 1}`}>
              <img
                className="w-20 h-20 object-cover border rounded-lg"
                src={
                  ![image1, image2, image3, image4][i]
                    ? assets.upload_area
                    : URL.createObjectURL([image1, image2, image3, image4][i])
                }
                alt=""
              />
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id={`image${i + 1}`}
                hidden
              />
            </label>
          ))}
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] py-2 border rounded-lg"
          type="text"
          placeholder="Enter product name"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] py-2 border rounded-lg"
          placeholder="Write product description here"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product Type</p>
          <select
            className="w-full px-3 py-2 border rounded-lg"
            onChange={(e) => setType(e.target.value)}
            value={type}
          >
            <option value="skincare">Skincare</option>
            <option value="makeup">Makeup</option>
            <option value="haircare">Haircare</option>
            <option value="body">Body</option>
            <option value="appliances">Appliances</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Brand</p>
          <select
            className="w-full px-3 py-2 border rounded-lg"
            onChange={(e) => setBrand(e.target.value)}
            value={brand}
          >
            <option value="uvdoux">UV Doux</option>
            <option value="technic">Technic</option>
            <option value="mamaearth">Mamaearth</option>
            <option value="cetaphil">Cetaphil</option>
            <option value="dermaco">Derma Co.</option>
            <option value="lagirl">L.A. Girl</option>
            <option value="lotus">Lotus</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px] border rounded-lg"
            type="number"
            placeholder="25"
            required
          />
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="checkbox"
          id="bestseller"
          checked={bestseller}
          onChange={() => setBestseller(!bestseller)}
        />
        <label htmlFor="bestseller">Add to bestseller</label>
      </div>

      <button
        type="submit"
        className="w-28 py-3 text-white bg-black rounded-lg cursor-pointer hover:bg-amber-900"
      >
        ADD
      </button>
    </form>
  );
};

export default Add;
