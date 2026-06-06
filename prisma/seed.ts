import { PrismaClient } from "@prisma/client";
import { buildSeedQuestions } from "./seed-data";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.question.count();
  if (count > 0) {
    console.log(`Questions already seeded (${count} records). Skipping.`);
    return;
  }

  const questions = buildSeedQuestions();
  await prisma.question.createMany({ data: questions });
  console.log(`Seeded ${questions.length} questions.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
