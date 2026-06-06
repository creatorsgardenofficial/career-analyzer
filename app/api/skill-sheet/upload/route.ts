import { NextResponse } from "next/server";
import { getSafeErrorMessage } from "@/lib/errors";
import {
  MAX_UPLOAD_SIZE,
  extractTextFromExcel,
  isAllowedExcelFile,
  isAllowedExcelMimeType,
} from "@/lib/excel";
import { structureSkillSheetText } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitMessage } from "@/lib/rate-limit";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session.user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const rateLimit = checkRateLimit({
      key: `skill-sheet-upload:${session.user.id}`,
      limit: 10,
      windowMs: 60 * 60 * 1000,
    });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: rateLimitMessage(rateLimit.retryAfterMs) },
        { status: 429 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "ファイルを選択してください" },
        { status: 400 },
      );
    }

    if (!isAllowedExcelFile(file.name)) {
      return NextResponse.json(
        { error: ".xlsx または .xls 形式のファイルをアップロードしてください" },
        { status: 400 },
      );
    }

    if (file.type && !isAllowedExcelMimeType(file.type)) {
      return NextResponse.json(
        { error: "許可されていないファイル形式です" },
        { status: 400 },
      );
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json(
        { error: "ファイルサイズは5MB以下にしてください" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extractedText = extractTextFromExcel(buffer);

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: "Excelからテキストを抽出できませんでした" },
        { status: 400 },
      );
    }

    const { structured, summary } = await structureSkillSheetText(extractedText);

    const record = await prisma.skillSheet.create({
      data: {
        userId: session.user.id,
        title: `スキルシート ${new Date().toLocaleDateString("ja-JP")}`,
        fileName: file.name,
        extractedText,
        structuredDataJson: structured,
        aiSummary: summary,
      },
    });

    return NextResponse.json({ id: record.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: getSafeErrorMessage(
          error,
          "スキルシートのアップロードに失敗しました",
        ),
      },
      { status: 500 },
    );
  }
}
