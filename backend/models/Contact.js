import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  businessHours: { type: String, required: true },
  emergencyContact: { type: String, required: true },
  socialLinks: {
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    instagram: { type: String, default: "" },
  },
}, { timestamps: true });

export default mongoose.model("Contact", contactSchema);