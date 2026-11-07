
import bcrypt from "bcrypt";
import prisma from "../src/config/database.js";

const DEMO_EMAIL = "demo@sweety.com";
const DEMO_PASSWORD =
  process.env.SEED_USER_PASSWORD || "SweetyDemo123!";

const slots = [
  { slot: "MORNING_FASTING", value: 105 },
  { slot: "AFTER_BREAKFAST", value: 145 },
  { slot: "AFTER_LUNCH", value: 135 },
  { slot: "AFTER_DINNER", value: 120 },
];

function getDateDaysAgo(daysAgo) {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date;
}

async function main() {
  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 12);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { name: "Sweety Demo User" },
    create: {
      name: "Sweety Demo User",
      email: DEMO_EMAIL,
      password: hashedPassword,
    },
  });

  const readings = [];

  // Add four sample readings for each of the last seven days.
  for (let daysAgo = 0; daysAgo < 7; daysAgo++) {
    for (const reading of slots) {
      readings.push({
        userId: user.id,
        date: getDateDaysAgo(daysAgo),
        slot: reading.slot,
        value: reading.value,
      });
    }
  }

  const result = await prisma.glucoseReading.createMany({
    data: readings,
    skipDuplicates: true,
  });

  console.log("Seed completed successfully!");
  console.log(`Demo email: ${DEMO_EMAIL}`);
  console.log(`Demo password: ${DEMO_PASSWORD}`);
  console.log(`New readings created: ${result.count}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
