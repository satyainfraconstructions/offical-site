import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
  content: {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    mission: { type: String, default: "" },
    vision: { type: String, default: "" },
  },
  teamMembers: [
    {
      id: { type: Number, required: true },
      name: { type: String, required: true },
      position: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
  companyStats: [
    {
      id: { type: Number, required: true },
      label: { type: String, required: true },
      value: { type: String, required: true },
    },
  ],
}, { timestamps: true });

export default mongoose.model("About", aboutSchema);