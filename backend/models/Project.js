import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["ongoing", "completed"] },
  title: { type: String, required: true },
  location: { type: String, required: true },
  budget: { type: String, default: "" },
  description: { type: String, required: true },
  // Ongoing project fields
  completion: { type: Number, default: 0 }, // Percentage (0-100)
  startDate: { type: String, default: "" },
  expectedCompletion: { type: String, default: "" },
  team: { type: Number, default: 0 },
  status: { 
    type: String, 
    default: "On Track",
    enum: ["On Track", "Delayed", "Ahead of Schedule", "On Hold"],
  },
  // Completed project fields
  completedDate: { type: String, default: "" },
  duration: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);