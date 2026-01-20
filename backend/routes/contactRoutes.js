import express from "express";
import mongoose from "mongoose";
import Contact from "../models/Contact.js";

const router = express.Router();

// ➡️ Get contact information and social links
router.get("/", async (req, res) => {
  try {
    const contact = await Contact.findOne();
    if (!contact) {
      return res.status(404).json({ message: "Contact information not found" });
    }
    res.json(contact);
  } catch (err) {
    console.error("GET contact error:", err);
    res.status(500).json({ message: `Failed to fetch contact information: ${err.message}` });
  }
});

// ➡️ Update contact information and social links
router.put("/", async (req, res) => {
  try {
    const { email, phone, address, businessHours, emergencyContact, socialLinks } = req.body;

    // Validate required fields
    if (!email || !phone || !address || !businessHours || !emergencyContact) {
      return res.status(400).json({ message: "Email, phone, address, business hours, and emergency contact are required" });
    }

    // Find or create contact document
    let contact = await Contact.findOne();
    if (!contact) {
      contact = new Contact({
        email,
        phone,
        address,
        businessHours,
        emergencyContact,
        socialLinks: socialLinks || {
          facebook: "",
          twitter: "",
          linkedin: "",
          instagram: "",
        },
      });
    } else {
      contact.email = email;
      contact.phone = phone;
      contact.address = address;
      contact.businessHours = businessHours;
      contact.emergencyContact = emergencyContact;
      contact.socialLinks = {
        facebook: socialLinks?.facebook || "",
        twitter: socialLinks?.twitter || "",
        linkedin: socialLinks?.linkedin || "",
        instagram: socialLinks?.instagram || "",
      };
    }

    await contact.save();
    res.json(contact);
  } catch (err) {
    console.error("PUT contact error:", err);
    res.status(500).json({ message: `Failed to update contact information: ${err.message}` });
  }
});

export default router;