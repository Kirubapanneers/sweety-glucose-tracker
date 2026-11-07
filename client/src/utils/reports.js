import {
  LOW_LIMIT,
  HIGH_LIMIT,
  average,
  formatShortDate,
  slotIndex,
  slotLabel,
} from "./glucose";

// The report endpoints are consumed read-only. Because the exact response
// shape is owned by the backend, this file is the single place that maps a
// report response to what the UI renders. It accepts the common shapes
// (summary fields at the top level or nested, and an optional readings list
// or per-day series) and derives anything that is missing from the readings.

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const pick = (source, keys) => {
  if (!source || typeof source !== "object") return null;
  for (const key of keys) {
    const number = toNumber(source[key]);
    if (number !== null) return number;
  }
  return null;
};

const firstArray = (source, keys) => {
  if (!source || typeof source !== "object") return null;
  for (const key of keys) {
    if (Array.isArray(source[key])) return source[key];
  }
  return null;
};

const firstString = (source, keys) => {
  if (!source || typeof source !== "object") return null;
  for (const key of keys) {
    if (typeof source[key] === "string" && source[key]) return source[key];
  }
  return null;
};

export function normalizeReport(raw, kind) {
  const root = raw?.report ?? raw?.data ?? raw ?? {};
  const summary =
    (root.summary && typeof root.summary === "object" && root.summary) ||
    (root.stats && typeof root.stats === "object" && root.stats) ||
    (root.statistics && typeof root.statistics === "object" && root.statistics) ||
    root;

  const readings = (firstArray(root, ["readings", "entries", "records"]) || [])
    .map((item) => ({
      id: item.id,
      value: toNumber(item.value),
      date: item.date ? String(item.date).slice(0, 10) : null,
      slot: item.slot || null,
    }))
    .filter((item) => item.value !== null);

  const values = readings.map((item) => item.value);

  const stats = {
    average:
      pick(summary, ["average", "avg", "averageValue", "averageGlucose", "mean"]) ??
      average(values),
    min:
      pick(summary, ["min", "minimum", "lowest", "lowestValue"]) ??
      (values.length ? Math.min(...values) : null),
    max:
      pick(summary, ["max", "maximum", "highest", "highestValue"]) ??
      (values.length ? Math.max(...values) : null),
    count:
      pick(summary, ["count", "totalReadings", "total", "readingsCount", "totalCount"]) ??
      (readings.length || null),
  };

  if (stats.average !== null) stats.average = Math.round(stats.average);

  stats.inRangePercent = values.length
    ? Math.round(
        (values.filter((v) => v >= LOW_LIMIT && v <= HIGH_LIMIT).length /
          values.length) *
          100
      )
    : null;

  // Chart series: prefer a series supplied by the API, otherwise derive one.
  const suppliedSeries = firstArray(root, [
    "trend",
    "dailyAverages",
    "dailyData",
    "days",
    "chart",
  ]);

  let series = [];
  if (suppliedSeries) {
    series = suppliedSeries
      .map((item) => {
        const value = toNumber(item.average ?? item.avg ?? item.value);
        const label = item.date
          ? formatShortDate(item.date)
          : item.label || item.day || "";
        return value === null ? null : { label, value };
      })
      .filter(Boolean);
  } else if (readings.length) {
    if (kind === "daily") {
      series = [...readings]
        .sort((a, b) => slotIndex(a.slot) - slotIndex(b.slot))
        .map((item) => ({ label: slotLabel(item.slot), value: item.value }));
    } else {
      const byDate = new Map();
      readings.forEach((item) => {
        if (!item.date) return;
        byDate.set(item.date, [...(byDate.get(item.date) || []), item.value]);
      });
      series = [...byDate.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, list]) => ({
          label: formatShortDate(date),
          value: average(list),
        }));
    }
  }

  const periodLabel =
    firstString(root, ["period", "label", "month", "title"]) ||
    (root.startDate && root.endDate
      ? `${formatShortDate(root.startDate)} – ${formatShortDate(root.endDate)}`
      : null) ||
    (root.from && root.to
      ? `${formatShortDate(root.from)} – ${formatShortDate(root.to)}`
      : null);

  const hasData =
    (stats.count ?? 0) > 0 || readings.length > 0 || stats.average !== null;

  return { stats, readings, series, periodLabel, hasData };
}
