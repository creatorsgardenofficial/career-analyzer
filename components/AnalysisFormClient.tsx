"use client";

import dynamic from "next/dynamic";
import type { DbQuestion } from "@/lib/questions";

const AnalysisForm = dynamic(
  () =>
    import("@/components/AnalysisForm").then((module) => module.AnalysisForm),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center text-sm text-zinc-600">
        保存データを読み込んでいます...
      </div>
    ),
  },
);

type AnalysisFormClientProps = {
  questions: DbQuestion[];
};

export function AnalysisFormClient({ questions }: AnalysisFormClientProps) {
  return <AnalysisForm questions={questions} />;
}
