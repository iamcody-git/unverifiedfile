import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Add Product
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, type, brand, bestseller } = req.body;

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter(Boolean);

    let imageUrls = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    // 🔹 Important Fix: save brand & type in lowercase
    const newProduct = new productModel({
      name,
      description,
      type: type.toLowerCase().trim(),
      brand: brand.toLowerCase().trim(),
      price: Number(price),
      bestseller: bestseller === "true",
      image: imageUrls,
      date: Date.now(),
    });

    await newProduct.save();

    res.json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// List Products
export const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products }); // return even if empty
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove Product
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await productModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Single Product
export const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};