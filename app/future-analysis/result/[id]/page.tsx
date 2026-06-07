import { notFound } from "next/navigation";
import { getFutureAnalysis } from "@/app/actions/futureAnalysis";
import { requireUser } from "@/lib/auth";
import { Header } from "@/components/Header";
import { CopyButton } from "@/components/CopyButton";
import { PdfExportButton } from "@/components/PdfExportButton";
import {
  StructuredResultView,
  parseStructuredText,
} from "@/components/StructuredResultView";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function FutureAnalysisResultPage({ params }: PageProps) {
  const user = await requireUser();
  const { id } = await params;
  const record = await getFutureAnalysis(id, user.id);

  if (!record) {
    notFound();
  }

  const sections = parseStructuredText(record.resultText);

  return (
    <>
      <Header userName={user.name} />
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">将来分析結果</h1>
            <p className="mt-2 break-words text-sm leading-7 text-zinc-600 sm:text-base">
              {record.targetEngineerType}
            </p>
          </div>
          <div className="grid gap-2 sm:flex">
            <CopyButton text={record.resultText} />
            <PdfExportButton title="将来分析結果" content={record.resultText} />
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-4 sm:p-6">
          <StructuredResultView sections={sections} />
        </div>
      </main>
    </>
  );
}
