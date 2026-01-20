
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Gallery from "../models/Gallery.js";
import mongoose from "mongoose";

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store in backend/uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error("Only image files (jpeg, jpg, png, gif) are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
});

// ➡️ Add new gallery item
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!title || !category) {
      return res.status(400).json({ message: "Title and category are required" });
    }
    const newGallery = new Gallery({
      title,
      description,
      category,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
    });
    await newGallery.save();
    res.json(newGallery);
  } catch (err) {
    console.error("POST error:", err);
    res.status(500).json({ message: `Failed to add gallery item: ${err.message}` });
  }
});

// ➡️ Get all gallery items
router.get("/", async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.json(gallery);
  } catch (err) {
    console.error("GET error:", err);
    res.status(500).json({ message: `Failed to fetch gallery items: ${err.message}` });
  }
});

// ➡️ Update gallery item (including image)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid gallery item ID" });
    }

    const { title, description, category } = req.body;
    if (!title || !category) {
      return res.status(400).json({ message: "Title and category are required" });
    }

    const updateData = { title, description, category };
    if (req.file) {
      // Check for existing item and its image
      const existingItem = await Gallery.findById(id);
      if (!existingItem) {
        return res.status(404).json({ message: "Gallery item not found" });
      }
      if (existingItem.imageUrl) {
        const oldImagePath = path.join(uploadDir, path.basename(existingItem.imageUrl));
        try {
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath); // Delete old image if it exists
            console.log(`Deleted old image: ${oldImagePath}`);
          } else {
            console.warn(`Old image not found: ${oldImagePath}`);
          }
        } catch (err) {
          console.warn(`Failed to delete old image: ${err.message}`);
          // Continue with update even if old image deletion fails
        }
      }
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedGallery = await Gallery.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedGallery) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    res.json(updatedGallery);
  } catch (err) {
    console.error("PUT error:", err);
    res.status(500).json({ message: `Failed to update gallery item: ${err.message}` });
  }
});

// ➡️ Delete gallery item
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid gallery item ID" });
    }

    const deletedGallery = await Gallery.findByIdAndDelete(id);
    if (!deletedGallery) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    // Delete associated image if it exists
    if (deletedGallery.imageUrl) {
      const imagePath = path.join(uploadDir, path.basename(deletedGallery.imageUrl));
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log(`Deleted image: ${imagePath}`);
        } else {
          console.warn(`Image not found: ${imagePath}`);
        }
      } catch (err) {
        console.warn(`Failed to delete image: ${err.message}`);
      }
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE error:", err);
    res.status(500).json({ message: `Failed to delete gallery item: ${err.message}` });
  }
});

export default router;
