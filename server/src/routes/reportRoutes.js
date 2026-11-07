import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  dailyReport,
  monthToDateReport,
  previousMonthReport,
} from "../controllers/reportController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/daily", dailyReport);
router.get("/month-to-date", monthToDateReport);
router.get("/previous-month", previousMonthReport);

export default router;
