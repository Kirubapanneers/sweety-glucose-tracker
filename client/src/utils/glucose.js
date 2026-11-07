// Shared constants and helpers for glucose readings.

export const MIN_GLUCOSE = 40;
export const MAX_GLUCOSE = 600;

// Indicative target range (mg/dL) used for colour coding only.
export const LOW_LIMIT = 70;
export const HIGH_LIMIT = 180;

export const SLOTS = [
  { value: "MORNING_FASTING", label: "Morning Fasting", short: "Fasting" },
  { value: "AFTER_BREAKFAST", label: "After Breakfast", short: "Breakfast" },
  { value: "AFTER_LUNCH", label: "After Lunch", short: "Lunch" },
  { value: "AFTER_DINNER", label: "After Dinner", short: "Dinner" },
];

export const slotLabel = (value) =>
  SLOTS.find((slot) => slot.value === value)?.label || value;

export const slotIndex = (value) => {
  const index = SLOTS.findIndex((slot) => slot.value === value);
  return index === -1 ? SLOTS.length : index;
};

// Today's date as YYYY-MM-DD in the user's local time zone.
export const today = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Accepts "YYYY-MM-DD" or a full ISO string and returns a local Date.
export const parseDate = (value) => {
  if (!value) return null;
  const [year, month, day] = String(value).slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

export const formatDate = (value, options) => {
  const date = parseDate(value);
  if (!date) return "";
  return date.toLocaleDateString(
    "en-IN",
    options || { weekday: "short", day: "numeric", month: "short", year: "numeric" }
  );
};

export const formatShortDate = (value) =>
  formatDate(value, { day: "numeric", month: "short" });

export const getStatus = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return { key: "none", label: "No data", tone: "neutral" };
  }
  const number = Number(value);
  if (number < LOW_LIMIT) return { key: "low", label: "Low", tone: "low" };
  if (number > HIGH_LIMIT) return { key: "high", label: "High", tone: "high" };
  return { key: "normal", label: "In range", tone: "normal" };
};

export const average = (values) => {
  if (!values.length) return null;
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export const getInitials = (name) => {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};
