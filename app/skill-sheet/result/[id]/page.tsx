import { notFound } from "next/navigation";
import { getSkillSheet } from "@/app/actions/skillSheet";
import { requireUser } from "@/lib/auth";
import { Header } from "@/components/Header";
import { SkillSheetEditor } from "@/components/SkillSheetEditor";
import { CopyButton } from "@/components/CopyButton";
import { PdfExportButton } from "@/components/PdfExportButton";
import type { StructuredSkillSheet } from "@/lib/validations";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function SkillSheetResultPage({ params }: PageProps) {
  const user = await requireUser();
  const { id } = await params;
  const record = await getSkillSheet(id, user.id);

  if (!record) {
    notFound();
  }

  const structured = record.structuredDataJson as StructuredSkillSheet;
  const exportText = [
    record.aiSummary ?? "",
    JSON.stringify(structured, null, 2),
  ].join("\n\n");

  return (
    <>
      <Header userName={user.name} />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">スキルシート読み取り結果</h1>
            <p className="mt-2 text-zinc-600">{record.fileName}</p>
          </div>
          <div className="flex gap-2">
            <CopyButton text={exportText} />
            <PdfExportButton title="スキルシート結果" content={exportText} />
          </div>
        </div>

        {record.aiSummary && (
          <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6">
            <h2 className="mb-2 font-semibold">AI要約</h2>
            <p className="text-sm leading-7">{record.aiSummary}</p>
          </div>
        )}

        <SkillSheetEditor
          id={record.id}
          initialData={structured}
          title={record.title}
        />
      </main>
    </>
  );
}
