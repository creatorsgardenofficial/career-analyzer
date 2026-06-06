import Link from "next/link";
import { formatDateTime } from "@/lib/dates";

export type HistoryItem = {
  id: string;
  type: "analysis" | "skillSheet" | "futureAnalysis" | "projectPreparation";
  title: string;
  createdAt: Date;
  href: string;
};

const TYPE_LABELS: Record<HistoryItem["type"], string> = {
  analysis: "個人分析",
  skillSheet: "スキルシート",
  futureAnalysis: "将来分析",
  projectPreparation: "案件対策",
};

type HistoryListProps = {
  items: HistoryItem[];
};

export function HistoryList({ items }: HistoryListProps) {
  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-zinc-500">
        履歴がありません
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-zinc-50 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">種別</th>
            <th className="px-4 py-3 font-medium">タイトル</th>
            <th className="px-4 py-3 font-medium">作成日時</th>
            <th className="px-4 py-3 font-medium">詳細</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={`${item.type}-${item.id}`} className="border-t border-zinc-100">
              <td className="px-4 py-3">{TYPE_LABELS[item.type]}</td>
              <td className="px-4 py-3">{item.title}</td>
              <td className="px-4 py-3">
                {formatDateTime(item.createdAt)}
              </td>
              <td className="px-4 py-3">
                <Link href={item.href} className="text-blue-600 hover:underline">
                  詳細を見る
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
