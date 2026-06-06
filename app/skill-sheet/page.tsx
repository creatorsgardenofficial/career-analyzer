import { requireUser } from "@/lib/auth";
import { Header } from "@/components/Header";
import { SkillSheetUploadForm } from "@/components/SkillSheetUploadForm";

export default async function SkillSheetPage() {
  const user = await requireUser();

  return (
    <>
      <Header userName={user.name} />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold">スキルシート読み取り</h1>
        <p className="mb-8 text-zinc-600">
          Excel形式のスキルシートをアップロードすると、職務経歴・技術スキルを抽出して構造化します。
        </p>
        <SkillSheetUploadForm />
      </main>
    </>
  );
}
