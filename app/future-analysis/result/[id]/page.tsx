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

  const sections = parseStructuredText(record.resultText);

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
          <StructuredResultView sections={sections} />
        </div>
      </main>
    </>
  );
}

type StructuredSection = {
  title: string;
  lines: string[];
};

function parseStructuredText(text: string): StructuredSection[] {
  const sections: StructuredSection[] = [];
  let current: StructuredSection | null = null;

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      current = { title: heading[1], lines: [] };
      sections.push(current);
      continue;
    }

    if (!current) {
      current = { title: "分析結果", lines: [] };
      sections.push(current);
    }
    current.lines.push(line);
  }

  return sections.length > 0
    ? sections
    : [{ title: "分析結果", lines: ["分析結果はまだありません。"] }];
}

function StructuredResultView({ sections }: { sections: StructuredSection[] }) {
  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <section
          key={section.title}
          className="rounded-lg border border-zinc-100 bg-zinc-50 p-4"
        >
          <h2 className="mb-3 text-lg font-semibold text-zinc-900">
            {section.title}
          </h2>
          <div className="space-y-2 text-sm leading-7 text-zinc-700">
            {section.lines.map((line, index) => {
              const bullet = line.match(/^[-・]\s*(.+)$/);
              const numbered = line.match(/^(\d+)[.)]\s*(.+)$/);

              if (bullet) {
                return (
                  <div key={`${section.title}-${index}`} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                    <p>{bullet[1]}</p>
                  </div>
                );
              }

              if (numbered) {
                return (
                  <div key={`${section.title}-${index}`} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                      {numbered[1]}
                    </span>
                    <p>{numbered[2]}</p>
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
