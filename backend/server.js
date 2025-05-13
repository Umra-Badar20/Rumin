import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js";
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "./.env") });

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// API Routes
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);

// Setup __dirname in ES modules
import { fileURLToPath } from "url";

// Serve static frontend files from ../frontend
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// Serve index.html for root or undefined routes
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
