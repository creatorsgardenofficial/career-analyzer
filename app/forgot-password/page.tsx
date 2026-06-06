import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4 py-16">
      <div className="w-full rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold">パスワード再設定</h1>
        <p className="mb-6 text-sm text-zinc-600">
          登録済みのメールアドレスを入力してください。
        </p>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
