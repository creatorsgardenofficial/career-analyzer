import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

type HeaderProps = {
  userName?: string;
};

export function Header({ userName }: HeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/dashboard" className="text-lg font-bold text-blue-700">
          SES Career Analyzer
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/dashboard" className="hover:text-blue-700">
            ダッシュボード
          </Link>
          <Link href="/analysis" className="hover:text-blue-700">
            個人分析
          </Link>
          <Link href="/skill-sheet" className="hover:text-blue-700">
            スキルシート
          </Link>
          <Link href="/future-analysis" className="hover:text-blue-700">
            将来分析
          </Link>
          <Link href="/project-preparation" className="hover:text-blue-700">
            案件対策
          </Link>
          <Link href="/history" className="hover:text-blue-700">
            履歴
          </Link>
          {userName && (
            <span className="text-zinc-500">{userName} さん</span>
          )}
          <LogoutButton />
        </nav>
      </div>
    </header>
  );
}
