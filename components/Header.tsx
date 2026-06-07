import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

type HeaderProps = {
  userName?: string;
};

export function Header({ userName }: HeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/dashboard"
          className="shrink-0 text-lg font-bold text-blue-700"
        >
          Career Analyzer
        </Link>
        <nav className="-mx-4 flex w-[calc(100%+2rem)] items-center gap-3 overflow-x-auto px-4 pb-1 text-sm sm:mx-0 sm:w-auto sm:overflow-visible sm:px-0 sm:pb-0">
          <Link href="/dashboard" className="shrink-0 hover:text-blue-700">
            {"\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9"}
          </Link>
          <Link href="/analysis" className="shrink-0 hover:text-blue-700">
            {"\u500b\u4eba\u5206\u6790"}
          </Link>
          <Link href="/skill-sheet" className="shrink-0 hover:text-blue-700">
            {"\u30b9\u30ad\u30eb\u30b7\u30fc\u30c8"}
          </Link>
          <Link href="/future-analysis" className="shrink-0 hover:text-blue-700">
            {"\u5c06\u6765\u5206\u6790"}
          </Link>
          <Link
            href="/project-preparation"
            className="shrink-0 hover:text-blue-700"
          >
            {"\u6848\u4ef6\u5bfe\u7b56"}
          </Link>
          <Link href="/history" className="shrink-0 hover:text-blue-700">
            {"\u5c65\u6b74"}
          </Link>
          {userName && (
            <span className="shrink-0 text-zinc-500">
              {userName} {"\u3055\u3093"}
            </span>
          )}
          <LogoutButton />
        </nav>
      </div>
    </header>
  );
}
