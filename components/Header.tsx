"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoutButton } from "@/components/LogoutButton";

type HeaderProps = {
  userName?: string;
};

const navItems = [
  { href: "/dashboard", label: "\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9" },
  { href: "/analysis", label: "\u500b\u4eba\u5206\u6790" },
  { href: "/skill-sheet", label: "\u30b9\u30ad\u30eb\u30b7\u30fc\u30c8" },
  { href: "/future-analysis", label: "\u5c06\u6765\u5206\u6790" },
  { href: "/project-preparation", label: "\u6848\u4ef6\u5bfe\u7b56" },
  { href: "/history", label: "\u5c65\u6b74" },
];

export function Header({ userName }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="shrink-0 text-lg font-bold text-blue-700"
            onClick={() => setIsMenuOpen(false)}
          >
            Career Analyzer
          </Link>
          <button
            type="button"
            aria-controls="site-navigation"
            aria-expanded={isMenuOpen}
            aria-label={
              isMenuOpen
                ? "\u30ca\u30d3\u30b2\u30fc\u30b7\u30e7\u30f3\u3092\u9589\u3058\u308b"
                : "\u30ca\u30d3\u30b2\u30fc\u30b7\u30e7\u30f3\u3092\u958b\u304f"
            }
            onClick={() => setIsMenuOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-300 text-zinc-700 hover:bg-zinc-50 sm:hidden"
          >
            <span className="sr-only">
              {isMenuOpen
                ? "\u30ca\u30d3\u30b2\u30fc\u30b7\u30e7\u30f3\u3092\u9589\u3058\u308b"
                : "\u30ca\u30d3\u30b2\u30fc\u30b7\u30e7\u30f3\u3092\u958b\u304f"}
            </span>
            <span className="flex flex-col gap-1" aria-hidden="true">
              <span
                className={`block h-0.5 w-5 rounded-full bg-current transition ${
                  isMenuOpen ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-current transition ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-current transition ${
                  isMenuOpen ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>

        <nav
          id="site-navigation"
          className={`mt-4 flex-col gap-1 border-t border-zinc-100 pt-3 text-sm sm:mt-0 sm:flex sm:flex-row sm:items-center sm:justify-end sm:gap-4 sm:border-t-0 sm:pt-0 ${
            isMenuOpen ? "flex" : "hidden"
          }`}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-2 hover:bg-zinc-50 hover:text-blue-700 sm:shrink-0 sm:px-0 sm:py-0 sm:hover:bg-transparent"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {userName && (
            <span className="px-2 py-2 text-zinc-500 sm:shrink-0 sm:px-0 sm:py-0">
              {userName} {"\u3055\u3093"}
            </span>
          )}
          <LogoutButton />
        </nav>
      </div>
    </header>
  );
}
