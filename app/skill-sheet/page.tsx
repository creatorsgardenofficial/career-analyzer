import { requireUser } from "@/lib/auth";
import { Header } from "@/components/Header";
import { SkillSheetUploadForm } from "@/components/SkillSheetUploadForm";

export default async function SkillSheetPage() {
  const user = await requireUser();

  return (
    <>
      <Header userName={user.name} />
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">スキルシート読み取り</h1>
        <p className="mb-6 text-sm leading-7 text-zinc-600 sm:mb-8 sm:text-base">
          Excel形式のスキルシートをアップロードすると、職務経歴・技術スキルを抽出して構造化します。
        </p>
        <SkillSheetUploadForm />
      </main>
    </>
  );
}
