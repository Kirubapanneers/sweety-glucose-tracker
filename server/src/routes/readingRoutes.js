import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createReading,
  getReadings,
  updateReading,
  deleteReading,
} from "../controllers/readingController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createReading);
router.get("/", getReadings);
router.put("/:id", updateReading);
router.delete("/:id", deleteReading);

export default router;
