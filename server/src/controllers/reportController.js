import {
  getDailyReport,
  getMonthToDateReport,
  getPreviousMonthReport,
} from "../services/reportService.js";

import { isValidDateOnly } from "../utils/validation.js";

const getToday = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const dailyReport = async (req, res) => {
  try {
    const date = req.query.date || getToday();

    if (!isValidDateOnly(date) || date > getToday()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid date that is not in the future",
      });
    }

    const report = await getDailyReport(req.user.userId, date);

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Daily report error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to generate daily report",
    });
  }
};

export const monthToDateReport = async (req, res) => {
  try {
    const date = req.query.date || getToday();

    if (!isValidDateOnly(date) || date > getToday()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid date that is not in the future",
      });
    }

    const report = await getMonthToDateReport(req.user.userId, date);

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Month-to-date report error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to generate month-to-date report",
    });
  }
};

export const previousMonthReport = async (req, res) => {
  try {
    const report = await getPreviousMonthReport(req.user.userId);

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Previous month report error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to generate previous month report",
    });
  }
};
