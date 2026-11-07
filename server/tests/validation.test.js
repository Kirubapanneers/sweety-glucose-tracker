
import test from "node:test";
import assert from "node:assert/strict";
import { readingSchema } from "../src/utils/validation.js";

const today = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const tomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const validReading = {
  value: 100,
  date: today(),
  slot: "MORNING_FASTING",
};

test("should accept a valid glucose reading", () => {
  const result = readingSchema.safeParse(validReading);

  assert.equal(result.success, true);
});

test("should reject a missing glucose value", () => {
  const { value, ...reading } = validReading;

  const result = readingSchema.safeParse(reading);

  assert.equal(result.success, false);
});

test("should reject glucose values below 40", () => {
  const result = readingSchema.safeParse({
    ...validReading,
    value: 39,
  });

  assert.equal(result.success, false);
});

test("should reject glucose values above 600", () => {
  const result = readingSchema.safeParse({
    ...validReading,
    value: 601,
  });

  assert.equal(result.success, false);
});

test("should reject decimal glucose values", () => {
  const result = readingSchema.safeParse({
    ...validReading,
    value: 100.5,
  });

  assert.equal(result.success, false);
});

test("should reject invalid calendar dates", () => {
  const result = readingSchema.safeParse({
    ...validReading,
    date: "2026-02-30",
  });

  assert.equal(result.success, false);
});

test("should reject future dates", () => {
  const result = readingSchema.safeParse({
    ...validReading,
    date: tomorrow(),
  });

  assert.equal(result.success, false);
});

test("should reject invalid reading slots", () => {
  const result = readingSchema.safeParse({
    ...validReading,
    slot: "AFTER_SNACK",
  });

  assert.equal(result.success, false);
});
