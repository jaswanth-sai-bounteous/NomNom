import express from "express";
import dotenv from "dotenv";
import { db } from "./db/db";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/users", userRoutes);
    
const PORT = process.env.PORT || 5000;

// Test DB connection
async function connectDB() {
  try {
    await db.execute("SELECT 1");
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed", error);
  }
}

connectDB();

app.get("/", (req, res) => {
  res.send("NomNom API running 🚀");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});