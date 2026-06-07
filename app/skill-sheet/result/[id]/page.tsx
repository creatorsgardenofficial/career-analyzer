import { notFound } from "next/navigation";
import { getSkillSheet } from "@/app/actions/skillSheet";
import { requireUser } from "@/lib/auth";
import { Header } from "@/components/Header";
import { SkillSheetEditor } from "@/components/SkillSheetEditor";
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

  return (
    <>
      <Header userName={user.name} />
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              スキルシート読み取り結果
            </h1>
            <p className="mt-2 break-all text-sm leading-7 text-zinc-600 sm:text-base">
              {record.fileName}
            </p>
          </div>
        </div>

        {record.aiSummary && (
          <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 sm:p-6">
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
