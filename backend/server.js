import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import entryRoutes from "./routes/entries.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "https://mindflow-journel.netlify.app",
    "http://localhost:3000"
  ],
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/entries", entryRoutes);

app.get("/api/health", (req, res) => 
  res.json({ status: "MindFlow API running 🌊" })
);

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/mindflow")
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => 
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB error:", err));
