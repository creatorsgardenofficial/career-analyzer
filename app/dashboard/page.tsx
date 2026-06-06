import Link from "next/link";
import { formatDateTime } from "@/lib/dates";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/Header";

export default async function DashboardPage() {
  const user = await requireUser();

  const [latestAnalysis, latestSkillSheet, latestFuture, latestProject] =
    await Promise.all([
      prisma.analysisResult.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.skillSheet.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.futureAnalysis.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.projectPreparation.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const latestStrengths = (latestAnalysis?.strengthsJson as string[]) ?? [];

  return (
    <>
      <Header userName={user.name} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold">ダッシュボード</h1>
        <p className="mb-8 text-zinc-600">{user.name} さん、ようこそ</p>

        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <NavCard href="/analysis" title="個人分析" desc="100問の適性診断" />
          <NavCard href="/skill-sheet" title="スキルシート" desc="Excel読み取り" />
          <NavCard href="/future-analysis" title="将来分析" desc="キャリアロードマップ" />
          <NavCard href="/project-preparation" title="案件対策" desc="面談準備資料生成" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SummaryCard
            title="最新の個人分析"
            empty="まだ個人分析がありません"
            link={latestAnalysis ? `/analysis/result/${latestAnalysis.id}` : "/analysis"}
          >
            {latestAnalysis && (
              <>
                <p>
                  {latestStrengths.length > 0
                    ? `強みとして表れた項目: ${latestStrengths.join("、")}`
                    : "回答傾向の分析結果を確認できます"}
                </p>
                <p className="text-sm text-zinc-500">
                  {formatDateTime(latestAnalysis.createdAt)}
                </p>
              </>
            )}
          </SummaryCard>

          <SummaryCard
            title="最新のスキルシート"
            empty="まだスキルシートがありません"
            link={latestSkillSheet ? `/skill-sheet/result/${latestSkillSheet.id}` : "/skill-sheet"}
          >
            {latestSkillSheet && (
              <>
                <p>{latestSkillSheet.fileName}</p>
                <p className="text-sm text-zinc-500">
                  {formatDateTime(latestSkillSheet.createdAt)}
                </p>
              </>
            )}
          </SummaryCard>

          <SummaryCard
            title="最新の将来分析"
            empty="まだ将来分析がありません"
            link={latestFuture ? `/future-analysis/result/${latestFuture.id}` : "/future-analysis"}
          >
            {latestFuture && (
              <>
                <p>{latestFuture.targetEngineerType}</p>
                <p className="text-sm text-zinc-500">
                  {formatDateTime(latestFuture.createdAt)}
                </p>
              </>
            )}
          </SummaryCard>

          <SummaryCard
            title="最新の案件対策"
            empty="まだ案件対策がありません"
            link={
              latestProject
                ? `/project-preparation/result/${latestProject.id}`
                : "/project-preparation"
            }
          >
            {latestProject && (
              <>
                <p>{latestProject.projectName ?? latestProject.title}</p>
                <p className="text-sm text-zinc-500">
                  {formatDateTime(latestProject.createdAt)}
                </p>
              </>
            )}
          </SummaryCard>
        </div>

        <div className="mt-8">
          <Link href="/history" className="text-blue-600 hover:underline">
            履歴一覧を見る
          </Link>
        </div>
      </main>
    </>
  );
}

function NavCard({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm hover:border-blue-300"
    >
      <h2 className="font-semibold text-blue-700">{title}</h2>
      <p className="mt-1 text-sm text-zinc-600">{desc}</p>
    </Link>
  );
}

function SummaryCard({
  title,
  empty,
  link,
  children,
}: {
  title: string;
  empty: string;
  link: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        <Link href={link} className="text-sm text-blue-600 hover:underline">
          詳細
        </Link>
      </div>
      {children ?? <p className="text-sm text-zinc-500">{empty}</p>}
    </div>
  );
}
