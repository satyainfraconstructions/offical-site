import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";

// const nodemailer = require('nodemailer');
// const bodyParser = require('body-parser');

import authRoutes from "./routes/auth.js";
import galleryRoutes from "./routes/gallery.js";

import adminRoutes from "./routes/adminRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors(
  {
    origin: "http://localhost:8080", // Adjust to your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
  }
));
app.use(express.json());

// ✅ Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/admin", adminRoutes); 
app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Construction Website Backend is running...");
});

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Or 'sendgrid', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // <— THIS LINE FIXES THE SSL ISSUE
  },
});

// Endpoint to send email
// === SEND EMAIL: Auto-reply to User + Notify Company ===
app.post("/api/contact/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  // === 1. Validate required fields ===
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required" });
  }

  // === 2. Validate email format ===
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  // === 3. Prevent header injection ===
  const unsafe = [name, email, message].some(field =>
    /[\r\n%<>]/.test(field)
  );
  if (unsafe) {
    return res.status(400).json({ error: "Invalid characters in input" });
  }

  const COMPANY_EMAIL = process.env.EMAIL_USER; // satyainfraconstructions@gmail.com
  const userEmail = email.trim();
  const userName = name.trim();

  try {
    // === EMAIL 1: Auto-reply to USER ===
    const userMail = {
      from: `"Satya Infra" <${COMPANY_EMAIL}>`,
      to: userEmail,
      replyTo: COMPANY_EMAIL,
      subject: `Thank You, ${userName}! We've Got Your Message`,
      text: `
Hello ${userName},

Thank you for reaching out to Satya Infra Constructions!

We've received your message and our team will get back to you within 24 hours.

Your Message:
"${message}"

—
Best regards,
Satya Infra Team
${COMPANY_EMAIL}
      `.trim(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background: #f9f9f9;">
          <h2 style="color: #1a56db;">Thank You, ${userName}!</h2>
          <p>We've received your message and will respond within <strong>24 hours</strong>.</p>
          <hr>
          <p><strong>Your Message:</strong></p>
          <blockquote style="background: #fff; padding: 15px; border-left: 4px solid #1a56db; margin: 15px 0; white-space: pre-wrap;">
            ${message.replace(/\n/g, '<br>')}
          </blockquote>
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            <strong>Satya Infra Constructions</strong><br>
            <a href="mailto:${COMPANY_EMAIL}">${COMPANY_EMAIL}</a>
          </p>
        </div>
      `.trim(),
    };

    // === EMAIL 2: Notify COMPANY ===
    const companyMail = {
      from: `"Website Contact" <${COMPANY_EMAIL}>`,
      to: COMPANY_EMAIL,
      subject: `New Contact Form: ${userName}`,
      text: `
New message from website:

Name: ${userName}
Email: ${userEmail}
Message: ${message}

—
Reply to: ${userEmail}
      `.trim(),
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #d32f2f;">New Contact Form Submission</h2>
          <hr>
          <p><strong>From:</strong> ${userName} &lt;<a href="mailto:${userEmail}">${userEmail}</a>&gt;</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #fff3e0; padding: 15px; border-left: 4px solid #ff9800; white-space: pre-wrap;">
            ${message.replace(/\n/g, '<br>')}
          </blockquote>
          <p style="margin-top: 20px; color: #d32f2f; font-weight: bold;">
            Reply to this email to respond directly.
          </p>
        </div>
      `.trim(),
    };

    // === Send both emails ===
    await Promise.all([
      transporter.sendMail(userMail),
      transporter.sendMail(companyMail)
    ]);

    res.status(200).json({ 
      message: "Message sent! Confirmation email delivered to user." 
    });

  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ 
      error: "Failed to send email", 
      details: error.message 
    });
  }
});


// Your existing /api/contact endpoint to fetch contactInfo
app.get('/api/contact', (req, res) => {
  // Fetch from DB or hardcode for now
  const contactData = {
    email: 'company@example.com',
    phone: '123-456-7890',
    // ... other fields
  };
  res.json(contactData);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
