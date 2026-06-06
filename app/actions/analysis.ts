"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import {
  calculateCategoryScores,
  getStrengthsAndWeaknesses,
} from "@/lib/analysis";
import { requireUser } from "@/lib/auth";
import { getSafeErrorMessage } from "@/lib/errors";
import { generatePersonalAnalysisComment } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { getQuestionsFromDb } from "@/lib/questions";
import { checkRateLimit, rateLimitMessage } from "@/lib/rate-limit";
import { analysisAnswersSchema } from "@/lib/validations";

export type AnalysisActionState = {
  error?: string;
};

export async function createAnalysisAction(
  _prevState: AnalysisActionState,
  formData: FormData,
): Promise<AnalysisActionState> {
  try {
    const user = await requireUser();

    const rateLimit = checkRateLimit({
      key: `analysis:${user.id}`,
      limit: 10,
      windowMs: 60 * 60 * 1000,
    });
    if (!rateLimit.allowed) {
      return { error: rateLimitMessage(rateLimit.retryAfterMs) };
    }

    const answersRaw = formData.get("answers");

    if (typeof answersRaw !== "string") {
      return { error: "回答データが不正です" };
    }

    const answers = JSON.parse(answersRaw) as Record<string, number>;
    const parsed = analysisAnswersSchema.safeParse({ answers });

    if (!parsed.success) {
      return { error: "回答内容を確認してください" };
    }

    const questions = await getQuestionsFromDb();
    if (questions.length === 0) {
      return {
        error:
          "質問マスタが未登録です。`npm run db:seed` を実行してください。",
      };
    }

    const missing = questions.filter((q) => !parsed.data.answers[q.id]);
    if (missing.length > 0) {
      return { error: `未回答の設問が${missing.length}件あります` };
    }

    const categoryScores = calculateCategoryScores(
      parsed.data.answers,
      questions,
    );
    const { strengths, weaknesses } = getStrengthsAndWeaknesses(categoryScores);

    const latestSkillSheet = await prisma.skillSheet.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const aiComment = await generatePersonalAnalysisComment({
      categoryScores,
      strengths,
      weaknesses,
      skillSheetSummary: latestSkillSheet?.aiSummary ?? undefined,
    });

    const result = await prisma.analysisResult.create({
      data: {
        userId: user.id,
        title: `個人分析 ${new Date().toLocaleDateString("ja-JP")}`,
        answersJson: parsed.data.answers,
        categoryScoresJson: categoryScores,
        strengthsJson: strengths,
        weaknessesJson: weaknesses,
        aiComment,
      },
    });

    redirect(`/analysis/result/${result.id}`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      error: getSafeErrorMessage(error, "分析の保存中にエラーが発生しました"),
    };
  }
}

export async function getAnalysisResult(id: string, userId: string) {
  return prisma.analysisResult.findFirst({
    where: { id, userId },
  });
}
