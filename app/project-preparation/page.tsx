import { requireUser } from "@/lib/auth";
import { Header } from "@/components/Header";
import { ProjectPreparationForm } from "@/components/ProjectPreparationForm";

export default async function ProjectPreparationPage() {
  const user = await requireUser();

  return (
    <>
      <Header userName={user.name} />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold">案件対策</h1>
        <p className="mb-8 text-zinc-600">
          案件概要を入力すると、自己紹介文・想定質問・回答例・逆質問を自動生成します。
        </p>
        <ProjectPreparationForm />
      </main>
    </>
  );
}
