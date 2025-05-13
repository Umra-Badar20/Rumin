import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';

import connectDB from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define frontend path (go up one level from backend, then into frontend)
const frontendPath = path.join(__dirname, 'frontend');

// Verify the frontend directory exists (for debugging)
if (!fs.existsSync(frontendPath)) {
  console.error('❌ Frontend directory not found at:', frontendPath);
  console.log('Current directory contents:', fs.readdirSync(__dirname));
} else {
  console.log('✅ Found frontend directory at:', frontendPath);
}

// Load environment variables
dotenv.config({ path: path.join(__dirname, "./.env") });

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5000', 'https://your-railway-app.up.railway.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);

console.log("Root directory contents:", fs.readdirSync(__dirname));
console.log("Parent directory contents:", fs.readdirSync(path.join(__dirname, '..')));
// Serve static files (HTML, CSS, JS)
app.use(express.static(frontendPath));

// Catch-all route for SPA (serves index.html for all other routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});