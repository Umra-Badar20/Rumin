import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import fs from 'fs';

// Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define frontend path (go up one level from backend, then into frontend)
const frontendPath = path.join(__dirname, '../frontend');

// Verify the path exists
if (!fs.existsSync(frontendPath)) {
  console.error('Frontend directory not found at:', frontendPath);
  console.log('Current directory contents:', fs.readdirSync(path.join(__dirname, '..')));
} else {
  console.log('Found frontend directory at:', frontendPath);
  console.log('Frontend contents:', fs.readdirSync(frontendPath));
}

// Serve static files
const app = express();
app.use(express.static(frontendPath));

// Catch-all route
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Load environment variables
dotenv.config({ path: path.join(__dirname, "./.env") });

// Connect to MongoDB
connectDB();


// Body parser and cookie parser
app.use(express.json());
app.use(cookieParser());

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:5000', 'https://rumin-production.up.railway.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// === API Routes ===
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// For single-page applications, add a catch-all route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// === Start Server ===
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// === Handle unhandled promise rejections ===
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
