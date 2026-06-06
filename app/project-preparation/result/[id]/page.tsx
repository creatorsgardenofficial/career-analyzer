import { notFound } from "next/navigation";
import { getProjectPreparation } from "@/app/actions/projectPreparation";
import { requireUser } from "@/lib/auth";
import { Header } from "@/components/Header";
import { CopyButton } from "@/components/CopyButton";
import { PdfExportButton } from "@/components/PdfExportButton";
import { formatDateWithHoliday, getHolidayNote } from "@/lib/dates";
import {
  parseProjectQuestions,
  parseReverseQuestions,
  parseSelfIntroduction,
} from "@/lib/validations";

type PageProps = {
  params: Promise<{ id: string }>;
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

  const selfIntroduction = parseSelfIntroduction(record.selfIntroduction);
  const questions = parseProjectQuestions(record.questionsJson);
  const reverseQuestions = parseReverseQuestions(record.reverseQuestionsJson);
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

        <div className="space-y-6">
          <section className="rounded-lg border border-zinc-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">自己紹介文</h2>
              <CopyButton
                text={`30秒版:\n${selfIntroduction.short}\n\n60秒版:\n${selfIntroduction.standard}`}
                label="コピー"
              />
            </div>
            <div className="space-y-4">
              <IntroCard
                title="30秒版"
                text={selfIntroduction.short}
              />
              <IntroCard
                title="60秒版"
                text={selfIntroduction.standard}
              />
            </div>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">
              想定質問10件と回答例
            </h2>
            <div className="space-y-4">
              {questions.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-zinc-100 bg-zinc-50 p-4"
                >
                  <p className="mb-3 font-medium">
                    {index + 1}. {item.question}
                  </p>
                  <div className="space-y-3 text-sm leading-7 text-zinc-700">
                    <InfoBlock label="回答例" text={item.answer} />
                    {item.intent && (
                      <InfoBlock label="回答の狙い" text={item.intent} />
                    )}
                    {item.avoid && (
                      <InfoBlock label="避けたい言い方" text={item.avoid} />
                    )}
                  </div>
                  <div className="mt-3">
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
            <div className="space-y-4">
              {reverseQuestions.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-zinc-100 bg-zinc-50 p-4"
                >
                  <p className="font-medium">
                    {index + 1}. {item.question}
                  </p>
                  {item.purpose && (
                    <p className="mt-2 text-sm leading-7 text-zinc-600">
                      目的: {item.purpose}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

function IntroCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4">
      <h3 className="mb-2 text-sm font-semibold text-blue-700">{title}</h3>
      <p className="whitespace-pre-wrap text-sm leading-7">{text}</p>
    </div>
  );
}

function InfoBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold text-zinc-500">{label}</p>
      <p className="whitespace-pre-wrap">{text}</p>
    </div>
  );
}
