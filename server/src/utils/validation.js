import { z } from "zod";

export const readingSlots = [
  "MORNING_FASTING",
  "AFTER_BREAKFAST",
  "AFTER_LUNCH",
  "AFTER_DINNER",
];

export const isValidDateOnly = (date) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsed = new Date(`${date}T00:00:00.000Z`);

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date
  );
};

const getTodayDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const readingSchema = z.object({
  value: z.number({
    error: "Please enter a glucose value.",
  })
    .int("Glucose value must be a whole number.")
    .min(40, "Value must be between 40 and 600 mg/dl.")
    .max(600, "Value must be between 40 and 600 mg/dl."),

    date: z.string({
    error: "Please provide a valid date in YYYY-MM-DD format.",
  })
    .refine(
      isValidDateOnly,
      "Please provide a valid date in YYYY-MM-DD format."
    )
    .refine(
      (date) => date <= getTodayDate(),
      "Date cannot be in the future."
    ),

  slot: z.enum(readingSlots, {
    error: "Please select a valid reading slot.",
  }),
});

