import { prisma } from "@/lib/prisma";
import {
  CATEGORY_LABELS,
  type CategoryKey,
} from "@/lib/analysis";
import { buildSeedQuestions } from "@/prisma/seed-data";

export type DbQuestion = {
  id: string;
  categoryKey: CategoryKey;
  categoryLabel: string;
  text: string;
  displayOrder: number;
};

export async function ensureQuestionMaster() {
  const count = await prisma.question.count();
  if (count > 0) return;

  const questions = buildSeedQuestions();
  await prisma.question.createMany({ data: questions });
}

export async function getQuestionsFromDb(): Promise<DbQuestion[]> {
  await ensureQuestionMaster();

  const records = await prisma.question.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return records.map((record) => ({
    id: record.id,
    categoryKey: record.category as CategoryKey,
    categoryLabel:
      CATEGORY_LABELS[record.category as CategoryKey] ?? record.category,
    text: record.questionText,
    displayOrder: record.displayOrder,
  }));
}
