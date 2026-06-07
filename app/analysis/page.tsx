import { requireUser } from "@/lib/auth";
import { Header } from "@/components/Header";
import { AnalysisFormClient } from "@/components/AnalysisFormClient";
import { getQuestionsFromDb } from "@/lib/questions";

export default async function AnalysisPage() {
  const user = await requireUser();
  const questions = await getQuestionsFromDb();

  return (
    <>
      <Header userName={user.name} />
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">個人分析</h1>
        <p className="mb-6 text-sm leading-7 text-zinc-600 sm:mb-8 sm:text-base">
          全{questions.length}問の5段階評価に回答してください。
        </p>

        {questions.length === 0 ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
            <p className="mb-2 font-medium">質問マスタが未登録です。</p>
            <p>
              管理者が <code className="rounded bg-amber-100 px-1">npm run db:seed</code>{" "}
              を実行してから再度お試しください。
            </p>
          </div>
        ) : (
          <AnalysisFormClient questions={questions} />
        )}
      </main>
    </>
  );
}
