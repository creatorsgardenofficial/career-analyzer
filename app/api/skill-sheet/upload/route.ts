import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  extractTextFromExcel,
  isAllowedExcelFile,
  MAX_UPLOAD_SIZE,
} from "@/lib/excel";
import { structureSkillSheetText } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session.user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
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
        error:
          error instanceof Error
            ? error.message
            : "スキルシートのアップロードに失敗しました",
      },
      { status: 500 },
    );
  }
}
