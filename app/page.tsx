import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-10 text-center sm:py-16">
      <h1 className="mb-4 text-3xl font-bold text-blue-700 sm:text-4xl">
        Career Analyzer
      </h1>
      <p className="mb-8 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
        {
          "SES\u30a8\u30f3\u30b8\u30cb\u30a2\u5411\u3051\u306e\u500b\u4eba\u5206\u6790\u30fb\u30b9\u30ad\u30eb\u30b7\u30fc\u30c8\u5206\u6790\u30fb\u5c06\u6765\u30ad\u30e3\u30ea\u30a2\u5206\u6790\u30fb\u6848\u4ef6\u9762\u8ac7\u5bfe\u7b56\u3092\u652f\u63f4\u3059\u308bWeb\u30a2\u30d7\u30ea\u3067\u3059\u3002"
        }
      </p>
      <div className="flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4">
        <Link
          href="/login"
          className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          {"\u30ed\u30b0\u30a4\u30f3"}
        </Link>
        <Link
          href="/register"
          className="rounded-md border border-zinc-300 px-6 py-3 hover:bg-white"
        >
          {"\u65b0\u898f\u767b\u9332"}
        </Link>
      </div>
    </main>
  );
}
