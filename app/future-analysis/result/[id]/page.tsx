import { notFound } from "next/navigation";
import { getFutureAnalysis } from "@/app/actions/futureAnalysis";
import { requireUser } from "@/lib/auth";
import { Header } from "@/components/Header";
import { CopyButton } from "@/components/CopyButton";
import { PdfExportButton } from "@/components/PdfExportButton";

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

  return (
    <>
      <Header userName={user.name} />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">将来分析結果</h1>
            <p className="mt-2 text-zinc-600">{record.targetEngineerType}</p>
          </div>
          <div className="flex gap-2">
            <CopyButton text={record.resultText} />
            <PdfExportButton title="将来分析結果" content={record.resultText} />
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <div className="prose-content text-sm">{record.resultText}</div>
        </div>
      </main>
    </>
  );
}
