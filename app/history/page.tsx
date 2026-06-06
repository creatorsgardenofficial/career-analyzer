import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";
import { HistoryList, type HistoryItem } from "@/components/HistoryList";

export default async function HistoryPage() {
  const user = await requireUser();

  const [analyses, skillSheets, futureAnalyses, projectPreparations] =
    await Promise.all([
      prisma.analysisResult.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.skillSheet.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.futureAnalysis.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.projectPreparation.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const items: HistoryItem[] = [
    ...analyses.map((item) => ({
      id: item.id,
      type: "analysis" as const,
      title: item.title ?? "個人分析",
      createdAt: item.createdAt,
      href: `/analysis/result/${item.id}`,
    })),
    ...skillSheets.map((item) => ({
      id: item.id,
      type: "skillSheet" as const,
      title: item.title ?? item.fileName,
      createdAt: item.createdAt,
      href: `/skill-sheet/result/${item.id}`,
    })),
    ...futureAnalyses.map((item) => ({
      id: item.id,
      type: "futureAnalysis" as const,
      title: item.title ?? item.targetEngineerType,
      createdAt: item.createdAt,
      href: `/future-analysis/result/${item.id}`,
    })),
    ...projectPreparations.map((item) => ({
      id: item.id,
      type: "projectPreparation" as const,
      title: item.title ?? item.projectName ?? "案件対策",
      createdAt: item.createdAt,
      href: `/project-preparation/result/${item.id}`,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <>
      <Header userName={user.name} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">履歴一覧</h1>
        <HistoryList items={items} />
      </main>
    </>
  );
}
