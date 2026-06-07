"use client";

import { logoutAction } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <form action={logoutAction} className="shrink-0">
      <button
        type="submit"
        className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50"
      >
        ログアウト
      </button>
    </form>
  );
}
