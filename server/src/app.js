import "dotenv/config";
import express from "express";
import cors from "cors";
import prisma from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import readingRoutes from "./routes/readingRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: "Sweety API and database are working",
      database: "connected",
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);

    res.status(503).json({
      success: false,
      message: "API is running, but database connection failed",
      database: "disconnected",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/readings", readingRoutes);
app.use("/api/reports", reportRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Sweety API running at http://localhost:${PORT}`);
});

export default app;
