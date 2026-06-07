import { requireUser } from "@/lib/auth";
import { Header } from "@/components/Header";
import { FutureAnalysisForm } from "@/components/FutureAnalysisForm";

export default async function FutureAnalysisPage() {
  const user = await requireUser();

  return (
    <>
      <Header userName={user.name} />
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">将来分析</h1>
        <p className="mb-6 text-sm leading-7 text-zinc-600 sm:mb-8 sm:text-base">
          なりたいエンジニア像を入力すると、個人分析結果とスキルシートをもとに1〜3年後のロードマップを生成します。
        </p>
        <FutureAnalysisForm />
      </main>
    </>
  );
}
