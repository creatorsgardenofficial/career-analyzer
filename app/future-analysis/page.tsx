import { requireUser } from "@/lib/auth";
import { Header } from "@/components/Header";
import { FutureAnalysisForm } from "@/components/FutureAnalysisForm";

export default async function FutureAnalysisPage() {
  const user = await requireUser();

  return (
    <>
      <Header userName={user.name} />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold">将来分析</h1>
        <p className="mb-8 text-zinc-600">
          なりたいエンジニア像を入力すると、個人分析結果とスキルシートをもとに1〜3年後のロードマップを生成します。
        </p>
        <FutureAnalysisForm />
      </main>
    </>
  );
}
