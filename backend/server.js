import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "./.env") });

// Connect to MongoDB
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(cookieParser());

// Enable CORS only for your frontend domain
const allowedOrigin = "https://rumin-production.up.railway.app";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true, // if using cookies/auth headers
  })
);

// Mount API routes
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);

// Serve frontend (if hosting from same backend)
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
