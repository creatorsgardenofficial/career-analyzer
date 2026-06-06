import { notFound } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getAnalysisResult } from "@/app/actions/analysis";
import { Header } from "@/components/Header";
import { AnalysisChart } from "@/components/AnalysisChart";
import { CopyButton } from "@/components/CopyButton";
import { PdfExportButton } from "@/components/PdfExportButton";
import {
  StructuredResultView,
  parseStructuredText,
} from "@/components/StructuredResultView";
import { extractCategoryScores } from "@/lib/analysis";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AnalysisResultPage({ params }: PageProps) {
  const user = await requireUser();
  const { id } = await params;
  const result = await getAnalysisResult(id, user.id);

  if (!result) {
    notFound();
  }

  const rawJson = result.categoryScoresJson as Record<string, unknown>;
  const scores = extractCategoryScores(rawJson);
  const strengths = (result.strengthsJson as string[]) ?? [];
  const weaknesses = (result.weaknessesJson as string[]) ?? [];
  const displayComment = removeProjectSections(result.aiComment);
  const commentSections = parseStructuredText(displayComment);

  return (
    <>
      <Header userName={user.name} />
      <main id="analysis-result-pdf" className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">個人分析結果</h1>
            <p className="mt-2 text-zinc-600">
              回答傾向をもとに、自己理解の材料として整理しています。
            </p>
          </div>
          <div className="flex gap-2" data-html2canvas-ignore="true">
            <CopyButton text={displayComment} label="コメントをコピー" />
            <Link
              href="/analysis?restart=1"
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50"
            >
              もう一度分析する
            </Link>
            <PdfExportButton
              title="個人分析結果"
              content={displayComment}
              targetId="analysis-result-pdf"
            />
          </div>
        </div>

        <AnalysisChart scores={scores} />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <InfoCard title="強みとして表れた項目">
            <ul className="list-disc pl-5">
              {strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </InfoCard>
          <InfoCard title="伸ばしたい項目">
            <ul className="list-disc pl-5">
              {weaknesses.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </InfoCard>
        </div>

        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">AI分析コメント</h2>
          <StructuredResultView sections={commentSections} />
        </div>
      </main>
    </>
  );
}

function removeProjectSections(comment: string) {
  return comment
    .replace(
      /##\s*(向いている案件|向いていない案件|避けた方がよい案件|注意すべき案件|注意点)[\s\S]*?(?=##\s|$)/g,
      "",
    )
    .trim();
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6">
      <h2 className="mb-3 font-semibold">{title}</h2>
      {children}
    </div>
  );
}
