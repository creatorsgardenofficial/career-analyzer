"use server";

import type { Prisma } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { getSafeErrorMessage } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { skillSheetUpdateSchema } from "@/lib/validations";

export type SkillSheetActionState = {
  error?: string;
  success?: string;
};

export async function updateSkillSheetAction(
  _prevState: SkillSheetActionState,
  formData: FormData,
): Promise<SkillSheetActionState> {
  try {
    const user = await requireUser();
    const structuredRaw = formData.get("structuredDataJson");
    const id = formData.get("id");
    const title = formData.get("title");

    if (typeof structuredRaw !== "string" || typeof id !== "string") {
      return { error: "更新データが不正です" };
    }

    const structuredDataJson = JSON.parse(structuredRaw);
    const parsed = skillSheetUpdateSchema.safeParse({
      id,
      structuredDataJson,
      title: typeof title === "string" ? title : undefined,
    });

    if (!parsed.success) {
      return { error: "入力内容を確認してください" };
    }

    const existing = await prisma.skillSheet.findFirst({
      where: { id: parsed.data.id, userId: user.id },
    });

    if (!existing) {
      return { error: "スキルシートが見つかりません" };
    }

    await prisma.skillSheet.update({
      where: { id: parsed.data.id },
      data: {
        structuredDataJson:
          parsed.data.structuredDataJson as Prisma.InputJsonValue,
        title: parsed.data.title ?? existing.title,
      },
    });

    return { success: "保存しました" };
  } catch (error) {
    console.error(error);
    return { error: getSafeErrorMessage(error, "スキルシートの更新に失敗しました") };
  }
}

export async function getSkillSheet(id: string, userId: string) {
  return prisma.skillSheet.findFirst({
    where: { id, userId },
  });
}
