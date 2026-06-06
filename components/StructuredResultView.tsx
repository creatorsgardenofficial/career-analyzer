export type StructuredSection = {
  title: string;
  lines: string[];
};

export function parseStructuredText(text: string): StructuredSection[] {
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

export function StructuredResultView({
  sections,
}: {
  sections: StructuredSection[];
}) {
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
