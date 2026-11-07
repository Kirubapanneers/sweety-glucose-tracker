import prisma from "../config/database.js";
import { readingSchema, isValidDateOnly } from "../utils/validation.js";

// POST /api/readings
export const createReading = async (req, res) => {
  try {
    const result = readingSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.issues[0].message,
      });
    }

    const { value, date, slot } = result.data;

    const reading = await prisma.glucoseReading.create({
      data: {
        userId: req.user.userId,
        value,
        date: new Date(`${date}T00:00:00.000Z`),
        slot,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Glucose reading added successfully",
      reading,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A reading already exists for this slot on this date",
      });
    }

    console.error("Create reading error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create reading",
    });
  }
};

// GET /api/readings
export const getReadings = async (req, res) => {
  try {
    const where = {
      userId: req.user.userId,
    };

    if (req.query.date) {
      if (!isValidDateOnly(req.query.date)) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format. Use YYYY-MM-DD",
        });
      }

      where.date = new Date(`${req.query.date}T00:00:00.000Z`);
    }

    const readings = await prisma.glucoseReading.findMany({
      where,
      orderBy: [
        { date: "desc" },
        { id: "desc" },
      ],
    });

    return res.status(200).json({
      success: true,
      count: readings.length,
      readings,
    });
  } catch (error) {
    console.error("Get readings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch readings",
    });
  }
};

// PUT /api/readings/:id
export const updateReading = async (req, res) => {
  try {
    const readingId = Number(req.params.id);

    if (!Number.isSafeInteger(readingId) || readingId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid reading ID",
      });
    }

    const result = readingSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.issues[0].message,
      });
    }

    const existingReading = await prisma.glucoseReading.findFirst({
      where: {
        id: readingId,
        userId: req.user.userId,
      },
    });

    if (!existingReading) {
      return res.status(404).json({
        success: false,
        message: "Reading not found",
      });
    }

    const { value, date, slot } = result.data;

    const reading = await prisma.glucoseReading.update({
      where: { id: readingId },
      data: {
        value,
        date: new Date(`${date}T00:00:00.000Z`),
        slot,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Reading updated successfully",
      reading,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A reading already exists for this slot on this date",
      });
    }

    console.error("Update reading error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update reading",
    });
  }
};

// DELETE /api/readings/:id
export const deleteReading = async (req, res) => {
  try {
    const readingId = Number(req.params.id);

    if (!Number.isSafeInteger(readingId) || readingId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid reading ID",
      });
    }

    const result = await prisma.glucoseReading.deleteMany({
      where: {
        id: readingId,
        userId: req.user.userId,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({
        success: false,
        message: "Reading not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reading deleted successfully",
    });
  } catch (error) {
    console.error("Delete reading error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete reading",
    });
  }
};

