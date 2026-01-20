import express from "express";
import mongoose from "mongoose";
import Project from "../models/Project.js";

const router = express.Router();

// ➡️ Get all projects (ongoing and completed)
router.get("/", async (req, res) => {
  try {
    const ongoingProjects = await Project.find({ type: "ongoing" });
    const completedProjects = await Project.find({ type: "completed" });
    res.json({ ongoingProjects, completedProjects });
  } catch (err) {
    console.error("GET projects error:", err);
    res.status(500).json({ message: `Failed to fetch projects: ${err.message}` });
  }
});

// ➡️ Add new ongoing project
router.post("/ongoing", async (req, res) => {
  try {
    const { title, location, budget, completion, startDate, expectedCompletion, team, status, description } = req.body;
    if (!title || !location || !description) {
      return res.status(400).json({ message: "Title, location, and description are required" });
    }

    const projectCount = await Project.countDocuments({ type: "ongoing" });
    const newProject = new Project({
      type: "ongoing",
      id: projectCount + 1, // Numeric ID for frontend compatibility
      title,
      location,
      budget,
      completion: completion || 0,
      startDate,
      expectedCompletion,
      team: team || 0,
      status: status || "On Track",
      description,
    });

    await newProject.save();
    res.json(newProject);
  } catch (err) {
    console.error("POST ongoing project error:", err);
    res.status(500).json({ message: `Failed to add ongoing project: ${err.message}` });
  }
});

// ➡️ Update ongoing project
router.put("/ongoing/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const { title, location, budget, completion, startDate, expectedCompletion, team, status, description } = req.body;

    // Validate _id
    if (!mongoose.isValidObjectId(_id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    if (!title || !location || !description) {
      return res.status(400).json({ message: "Title, location, and description are required" });
    }

    const project = await Project.findOne({ type: "ongoing", _id });
    if (!project) {
      return res.status(404).json({ message: "Ongoing project not found" });
    }

    project.title = title;
    project.location = location;
    project.budget = budget;
    project.completion = completion || 0;
    project.startDate = startDate;
    project.expectedCompletion = expectedCompletion;
    project.team = team || 0;
    project.status = status || "On Track";
    project.description = description;

    await project.save();
    res.json(project);
  } catch (err) {
    console.error("PUT ongoing project error:", err);
    res.status(500).json({ message: `Failed to update ongoing project: ${err.message}` });
  }
});

// ➡️ Delete ongoing project
router.delete("/ongoing/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    if (!mongoose.isValidObjectId(_id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findOneAndDelete({ type: "ongoing", _id });
    if (!project) {
      return res.status(404).json({ message: "Ongoing project not found" });
    }
    res.json({ message: "Ongoing project deleted successfully" });
  } catch (err) {
    console.error("DELETE ongoing project error:", err);
    res.status(500).json({ message: `Failed to delete ongoing project: ${err.message}` });
  }
});

// ➡️ Add new completed project
router.post("/completed", async (req, res) => {
  try {
    const { title, location, budget, completedDate, team, duration, description } = req.body;
    if (!title || !location || !description) {
      return res.status(400).json({ message: "Title, location, and description are required" });
    }

    const projectCount = await Project.countDocuments({ type: "completed" });
    const newProject = new Project({
      type: "completed",
      id: projectCount + 101,
      title,
      location,
      budget,
      completedDate,
      team: team || 0,
      duration,
      description,
    });

    await newProject.save();
    res.json(newProject);
  } catch (err) {
    console.error("POST completed project error:", err);
    res.status(500).json({ message: `Failed to add completed project: ${err.message}` });
  }
});

// ➡️ Update completed project
router.put("/completed/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const { title, location, budget, completedDate, team, duration, description } = req.body;

    if (!mongoose.isValidObjectId(_id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    if (!title || !location || !description) {
      return res.status(400).json({ message: "Title, location, and description are required" });
    }

    const project = await Project.findOne({ type: "completed", _id });
    if (!project) {
      return res.status(404).json({ message: "Completed project not found" });
    }

    project.title = title;
    project.location = location;
    project.budget = budget;
    project.completedDate = completedDate;
    project.team = team || 0;
    project.duration = duration;
    project.description = description;

    await project.save();
    res.json(project);
  } catch (err) {
    console.error("PUT completed project error:", err);
    res.status(500).json({ message: `Failed to update completed project: ${err.message}` });
  }
});

// ➡️ Delete completed project
router.delete("/completed/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    if (!mongoose.isValidObjectId(_id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findOneAndDelete({ type: "completed", _id });
    if (!project) {
      return res.status(404).json({ message: "Completed project not found" });
    }
    res.json({ message: "Completed project deleted successfully" });
  } catch (err) {
    console.error("DELETE completed project error:", err);
    res.status(500).json({ message: `Failed to delete completed project: ${err.message}` });
  }
});

export default router;