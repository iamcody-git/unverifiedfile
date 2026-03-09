import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true }, // formerly category
  brand: { type: String, required: true }, // formerly subCategory
  price: { type: Number, required: true },
  bestseller: { type: Boolean, default: false },
  image: { type: [String], required: true },
  date: { type: Number, required: true },
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);
export default productModel;
