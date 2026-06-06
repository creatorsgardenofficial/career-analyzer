"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import type { CategoryKey } from "@/lib/analysis";
import { requireUser } from "@/lib/auth";
import { generateProjectPreparation } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import {
  projectPreparationInputSchema,
  type StructuredSkillSheet,
} from "@/lib/validations";

export type ProjectPreparationActionState = {
  error?: string;
};

export async function createProjectPreparationAction(
  _prevState: ProjectPreparationActionState,
  formData: FormData,
): Promise<ProjectPreparationActionState> {
  try {
    const user = await requireUser();

    const parsed = projectPreparationInputSchema.safeParse({
      projectName: formData.get("projectName") || undefined,
      projectDescription: formData.get("projectDescription"),
      requiredSkills: formData.get("requiredSkills") || undefined,
      preferredSkills: formData.get("preferredSkills") || undefined,
      workProcess: formData.get("workProcess") || undefined,
      technologies: formData.get("technologies") || undefined,
      desiredPersonality: formData.get("desiredPersonality") || undefined,
      workStyle: formData.get("workStyle") || undefined,
      interviewDate: formData.get("interviewDate") || undefined,
      concerns: formData.get("concerns") || undefined,
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

    const generated = await generateProjectPreparation({
      input: parsed.data,
      categoryScores,
      strengths,
      weaknesses,
      skillSheet,
    });

    const record = await prisma.projectPreparation.create({
      data: {
        userId: user.id,
        title: parsed.data.projectName ?? `案件対策 ${new Date().toLocaleDateString("ja-JP")}`,
        projectName: parsed.data.projectName,
        interviewDate: parsed.data.interviewDate,
        projectDescription: parsed.data.projectDescription,
        selfIntroduction: generated.selfIntroduction,
        questionsJson: generated.questions,
        reverseQuestionsJson: generated.reverseQuestions,
        fullResultText: generated.fullResultText,
      },
    });

    redirect(`/project-preparation/result/${record.id}`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "案件対策の生成中にエラーが発生しました",
    };
  }
}

export async function getProjectPreparation(id: string, userId: string) {
  return prisma.projectPreparation.findFirst({
    where: { id, userId },
  });
}
