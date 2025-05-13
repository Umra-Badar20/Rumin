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

// === Serve Frontend ===
// Assuming project root has both /frontend and /backend
const frontendPath = path.join(__dirname, "../frontend");
console.log("Serving static from:", frontendPath); // Debug log

app.use(express.static(frontendPath));

// Catch-all for client-side routing (avoiding API paths)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
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
