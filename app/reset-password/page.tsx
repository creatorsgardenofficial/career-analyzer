import Link from "next/link";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center px-4 py-8 sm:py-16">
        <div className="w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="mb-4 text-2xl font-bold">パスワード再設定</h1>
          <p className="mb-4 text-sm text-red-700">
            再設定トークンが見つかりません。もう一度お試しください。
          </p>
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            パスワード再設定をやり直す
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4 py-8 sm:py-16">
      <div className="w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-6 text-2xl font-bold">新しいパスワードの設定</h1>
        <ResetPasswordForm token={token} />
      </div>
    </main>
  );
}
