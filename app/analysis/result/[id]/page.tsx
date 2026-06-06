import { notFound } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getAnalysisResult } from "@/app/actions/analysis";
import { Header } from "@/components/Header";
import { AnalysisChart } from "@/components/AnalysisChart";
import { CopyButton } from "@/components/CopyButton";
import { PdfExportButton } from "@/components/PdfExportButton";
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
  const commentSections = parseAnalysisComment(displayComment);

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
          <AnalysisCommentView sections={commentSections} />
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

type AnalysisCommentSection = {
  title: string;
  lines: string[];
};

function parseAnalysisComment(comment: string): AnalysisCommentSection[] {
  const sections: AnalysisCommentSection[] = [];
  let current: AnalysisCommentSection | null = null;

  for (const rawLine of comment.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      current = { title: heading[1], lines: [] };
      sections.push(current);
      continue;
    }

    if (!current) {
      current = { title: "分析コメント", lines: [] };
      sections.push(current);
    }
    current.lines.push(line);
  }

  return sections.length > 0
    ? sections
    : [{ title: "分析コメント", lines: ["分析コメントはまだありません。"] }];
}

function AnalysisCommentView({
  sections,
}: {
  sections: AnalysisCommentSection[];
}) {
  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <section
          key={section.title}
          className="rounded-lg border border-zinc-100 bg-zinc-50 p-4"
        >
          <h3 className="mb-3 text-base font-semibold text-zinc-900">
            {section.title}
          </h3>
          <div className="space-y-2 text-sm leading-7 text-zinc-700">
            {section.lines.map((line, index) => {
              const bullet = line.match(/^[-・]\s*(.+)$/);
              if (bullet) {
                return (
                  <div key={`${section.title}-${index}`} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                    <p>{bullet[1]}</p>
                  </div>
                );
              }

              return <p key={`${section.title}-${index}`}>{line}</p>;
            })}
          </div>
        </section>
      ))}
    </div>
  );
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
