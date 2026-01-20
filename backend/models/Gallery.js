import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, required: true }, // Add category field
  imageUrl: { type: String, required: false }, // Make imageUrl optional
}, { timestamps: true });

export default mongoose.model("Gallery", GallerySchema);