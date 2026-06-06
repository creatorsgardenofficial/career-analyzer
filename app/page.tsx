import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="mb-4 text-4xl font-bold text-blue-700">
        SES Career Analyzer
      </h1>
      <p className="mb-8 max-w-2xl text-lg text-zinc-600">
        SESエンジニア向けの個人分析・スキルシート分析・将来キャリア分析・案件面談対策を支援するWebアプリです。
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          ログイン
        </Link>
        <Link
          href="/register"
          className="rounded-md border border-zinc-300 px-6 py-3 hover:bg-white"
        >
          新規登録
        </Link>
      </div>
    </main>
  );
}
