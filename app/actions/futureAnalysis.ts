"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import type { CategoryKey } from "@/lib/analysis";
import { requireUser } from "@/lib/auth";
import { generateFutureAnalysis } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import {
  futureAnalysisInputSchema,
  type StructuredSkillSheet,
} from "@/lib/validations";

export type FutureAnalysisActionState = {
  error?: string;
};

export async function createFutureAnalysisAction(
  _prevState: FutureAnalysisActionState,
  formData: FormData,
): Promise<FutureAnalysisActionState> {
  try {
    const user = await requireUser();

    const parsed = futureAnalysisInputSchema.safeParse({
      targetEngineerType: formData.get("targetEngineerType"),
      interestedTechnologies: formData.get("interestedTechnologies") || undefined,
      preferredWorkStyle: formData.get("preferredWorkStyle") || undefined,
      weakTasks: formData.get("weakTasks") || undefined,
      avoidTasks: formData.get("avoidTasks") || undefined,
      preferredProjects: formData.get("preferredProjects") || undefined,
      targetSalary: formData.get("targetSalary") || undefined,
      studyTime: formData.get("studyTime") || undefined,
      notes: formData.get("notes") || undefined,
    });

    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "入力内容を確認してください" };
    }

    const latestAnalysis = await prisma.analysisResult.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const latestSkillSheet = await prisma.skillSheet.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const categoryScores =
      (latestAnalysis?.categoryScoresJson as Record<CategoryKey, number>) ?? {};
    const strengths = (latestAnalysis?.strengthsJson as string[]) ?? [];
    const weaknesses = (latestAnalysis?.weaknessesJson as string[]) ?? [];
    const skillSheet =
      (latestSkillSheet?.structuredDataJson as StructuredSkillSheet) ?? null;

    const resultText = await generateFutureAnalysis({
      input: parsed.data,
      categoryScores,
      strengths,
      weaknesses,
      skillSheet,
    });

    const record = await prisma.futureAnalysis.create({
      data: {
        userId: user.id,
        title: `将来分析 ${new Date().toLocaleDateString("ja-JP")}`,
        targetEngineerType: parsed.data.targetEngineerType,
        inputJson: parsed.data,
        resultText,
      },
    });

    redirect(`/future-analysis/result/${record.id}`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "将来分析の生成中にエラーが発生しました",
    };
  }
}

export async function getFutureAnalysis(id: string, userId: string) {
  return prisma.futureAnalysis.findFirst({
    where: { id, userId },
  });
}
