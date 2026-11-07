import prisma from "../config/database.js";

const getStatistics = async (where) => {
  const result = await prisma.glucoseReading.aggregate({
    where,
    _count: {
      _all: true,
    },
    _max: {
      value: true,
    },
    _min: {
      value: true,
    },
    _avg: {
      value: true,
    },
  });

  const count = result._count._all;

  return {
    highest: result._max.value,
    lowest: result._min.value,
    average:
      result._avg.value === null
        ? null
        : Number(result._avg.value.toFixed(1)),
    count,
  };
};

export const getDailyReport = async (userId, date) => {
  const where = {
    userId,
    date: new Date(`${date}T00:00:00.000Z`),
  };

  const [readings, statistics] = await Promise.all([
    prisma.glucoseReading.findMany({
      where,
      orderBy: {
        slot: "asc",
      },
    }),
    getStatistics(where),
  ]);

  return {
    date,
    statistics,
    readings,
  };
};

export const getMonthToDateReport = async (userId, selectedDate) => {
  const [year, month, day] = selectedDate.split("-").map(Number);

  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month - 1, day + 1));

  const where = {
    userId,
    date: {
      gte: startDate,
      lt: endDate,
    },
  };

  const statistics = await getStatistics(where);

  return {
    period: {
      start: startDate.toISOString().slice(0, 10),
      end: selectedDate,
    },
    statistics,
  };
};

export const getPreviousMonthReport = async (userId) => {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth();

  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 1));

  const where = {
    userId,
    date: {
      gte: startDate,
      lt: endDate,
    },
  };

  const statistics = await getStatistics(where);

  const previousMonth = startDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return {
    period: {
      name: previousMonth,
      start: startDate.toISOString().slice(0, 10),
      end: new Date(endDate.getTime() - 86400000)
        .toISOString()
        .slice(0, 10),
    },
    statistics,
  };
};
