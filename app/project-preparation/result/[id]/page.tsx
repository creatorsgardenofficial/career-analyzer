import { notFound } from "next/navigation";
import { getProjectPreparation } from "@/app/actions/projectPreparation";
import { requireUser } from "@/lib/auth";
import { Header } from "@/components/Header";
import { CopyButton } from "@/components/CopyButton";
import { PdfExportButton } from "@/components/PdfExportButton";
import { formatDateWithHoliday, getHolidayNote } from "@/lib/dates";

type PageProps = {
  params: Promise<{ id: string }>;
};

type QuestionItem = {
  question: string;
  answer: string;
};

export default async function ProjectPreparationResultPage({
  params,
}: PageProps) {
  const user = await requireUser();
  const { id } = await params;
  const record = await getProjectPreparation(id, user.id);

  if (!record) {
    notFound();
  }

  const questions = record.questionsJson as QuestionItem[];
  const reverseQuestions = record.reverseQuestionsJson as string[];
  const holidayNote = getHolidayNote(record.interviewDate);

  return (
    <>
      <Header userName={user.name} />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">案件対策結果</h1>
            <p className="mt-2 text-zinc-600">
              {record.projectName ?? record.title}
            </p>
            {record.interviewDate && (
              <p className="mt-1 text-sm text-zinc-500">
                面談予定日: {formatDateWithHoliday(record.interviewDate)}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <CopyButton text={record.fullResultText} />
            <PdfExportButton
              title="案件対策結果"
              content={record.fullResultText}
            />
          </div>
        </div>

        {holidayNote && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            {holidayNote}
          </div>
        )}

        <section className="mb-8 rounded-lg border border-zinc-200 bg-white p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold">自己紹介文</h2>
            <CopyButton text={record.selfIntroduction} label="コピー" />
          </div>
          <p className="whitespace-pre-wrap text-sm leading-7">
            {record.selfIntroduction}
          </p>
        </section>

        <section className="mb-8 rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">想定質問10件と回答例</h2>
          <div className="space-y-6">
            {questions.map((item, index) => (
              <div key={index} className="border-t border-zinc-100 pt-4 first:border-0 first:pt-0">
                <p className="mb-2 font-medium">
                  {index + 1}. {item.question}
                </p>
                <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-700">
                  {item.answer}
                </p>
                <div className="mt-2">
                  <CopyButton
                    text={`Q: ${item.question}\nA: ${item.answer}`}
                    label="このQ&Aをコピー"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">逆質問5件</h2>
          <ol className="list-decimal space-y-3 pl-5 text-sm">
            {reverseQuestions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ol>
        </section>
      </main>
    </>
  );
}
