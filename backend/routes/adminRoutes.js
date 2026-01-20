import express from "express";
import mongoose from "mongoose";
import About from "../models/About.js";

const router = express.Router();

// ➡️ Get About section data
router.get("/", async (req, res) => {
  try {
    let aboutData = await About.findOne();
    if (!aboutData) {
      aboutData = await About.create({
        content: { title: "", description: "", mission: "", vision: "" },
        teamMembers: [],
        companyStats: [],
      });
    }
    res.json(aboutData);
  } catch (err) {
    console.error("GET error:", err);
    res.status(500).json({ message: `Failed to fetch about data: ${err.message}` });
  }
});

// ➡️ Update About content (title, description, mission, vision)
router.put("/content", async (req, res) => {
  try {
    const { title, description, mission, vision } = req.body;
    if (!title || !description || !mission || !vision) {
      return res.status(400).json({ message: "All content fields are required" });
    }

    let aboutData = await About.findOne();
    if (!aboutData) {
      aboutData = new About({
        content: { title, description, mission, vision },
        teamMembers: [],
        companyStats: [],
      });
    } else {
      aboutData.content = { title, description, mission, vision };
    }

    await aboutData.save();
    res.json(aboutData);
  } catch (err) {
    console.error("PUT content error:", err);
    res.status(500).json({ message: `Failed to update about content: ${err.message}` });
  }
});

// ➡️ Add new team member
router.post("/team", async (req, res) => {
  try {
    const { name, position, description } = req.body;
    if (!name || !position || !description) {
      return res.status(400).json({ message: "Name, position, and description are required" });
    }

    let aboutData = await About.findOne();
    if (!aboutData) {
      aboutData = new About({
        content: { title: "", description: "", mission: "", vision: "" },
        teamMembers: [],
        companyStats: [],
      });
    }

    const newTeamMember = {
      id: aboutData.teamMembers.length
        ? Math.max(...aboutData.teamMembers.map((m) => m.id)) + 1
        : 1,
      name,
      position,
      description,
    };

    aboutData.teamMembers.push(newTeamMember);
    await aboutData.save();
    res.json(newTeamMember);
  } catch (err) {
    console.error("POST team error:", err);
    res.status(500).json({ message: `Failed to add team member: ${err.message}` });
  }
});

// ➡️ Update team member
router.put("/team/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, description } = req.body;
    // Remove ObjectId validation since id is numeric
    if (!name || !position || !description) {
      return res.status(400).json({ message: "Name, position, and description are required" });
    }

    const aboutData = await About.findOne();
    if (!aboutData) {
      return res.status(404).json({ message: "About data not found" });
    }

    const teamMember = aboutData.teamMembers.find((m) => m.id === parseInt(id));
    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    teamMember.name = name;
    teamMember.position = position;
    teamMember.description = description;

    await aboutData.save();
    res.json(teamMember);
  } catch (err) {
    console.error("PUT team error:", err);
    res.status(500).json({ message: `Failed to update team member: ${err.message}` });
  }
});

// ➡️ Delete team member
router.delete("/team/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid about document ID" });
    }

    const aboutData = await About.findOne();
    if (!aboutData) {
      return res.status(404).json({ message: "About data not found" });
    }

    const teamMemberIndex = aboutData.teamMembers.findIndex((m) => m.id === parseInt(id));
    if (teamMemberIndex === -1) {
      return res.status(404).json({ message: "Team member not found" });
    }

    aboutData.teamMembers.splice(teamMemberIndex, 1);
    await aboutData.save();
    res.json({ message: "Team member deleted successfully" });
  } catch (err) {
    console.error("DELETE team error:", err);
    res.status(500).json({ message: `Failed to delete team member: ${err.message}` });
  }
});

// ➡️ Add new company statistic
router.post("/stats", async (req, res) => {
  try {
    const { label, value } = req.body;
    if (!label || !value) {
      return res.status(400).json({ message: "Label and value are required" });
    }

    let aboutData = await About.findOne();
    if (!aboutData) {
      aboutData = new About({
        content: { title: "", description: "", mission: "", vision: "" },
        teamMembers: [],
        companyStats: [],
      });
    }

    const newStat = {
      id: aboutData.companyStats.length
        ? Math.max(...aboutData.companyStats.map((s) => s.id)) + 1
        : 1,
      label,
      value,
    };

    aboutData.companyStats.push(newStat);
    await aboutData.save();
    res.json(newStat);
  } catch (err) {
    console.error("POST stats error:", err);
    res.status(500).json({ message: `Failed to add company statistic: ${err.message}` });
  }
});

// ➡️ Update company statistic
// PUT /api/admin/stats/:arrayId
router.put("/stats/:arrayId", async (req, res) => {
  try {
    const { arrayId } = req.params; // This is your custom stat.id (1, 2, 3)
    const { label, value } = req.body;

    if (!label || !value) {
      return res.status(400).json({ message: "Label and value are required" });
    }

    // Convert to number
    const statId = parseInt(arrayId);
    if (isNaN(statId)) {
      return res.status(400).json({ message: "Invalid statistic ID" });
    }

    const aboutData = await About.findOne();
    if (!aboutData) {
      return res.status(404).json({ message: "About data not found" });
    }

    const stat = aboutData.companyStats.find((s) => s.id === statId);
    if (!stat) {
      return res.status(404).json({ message: "Statistic not found" });
    }

    stat.label = label;
    stat.value = value;

    await aboutData.save();
    res.json(stat);
  } catch (err) {
    console.error("PUT stats error:", err);
    res.status(500).json({ message: `Failed to update: ${err.message}` });
  }
});

// ➡️ Delete company statistic
router.delete("/stats/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid about document ID" });
    }

    const aboutData = await About.findOne();
    if (!aboutData) {
      return res.status(404).json({ message: "About data not found" });
    }

    const statIndex = aboutData.companyStats.findIndex((s) => s.id === parseInt(id));
    if (statIndex === -1) {
      return res.status(404).json({ message: "Statistic not found" });
    }

    aboutData.companyStats.splice(statIndex, 1);
    await aboutData.save();
    res.json({ message: "Statistic deleted successfully" });
  } catch (err) {
    console.error("DELETE stats error:", err);
    res.status(500).json({ message: `Failed to delete company statistic: ${err.message}` });
  }
});

export default router;