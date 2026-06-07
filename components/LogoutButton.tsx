"use client";

import { logoutAction } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <form action={logoutAction} className="w-full shrink-0 sm:w-auto">
      <button
        type="submit"
        className="w-full rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50 sm:w-auto"
      >
        ログアウト
      </button>
    </form>
  );
}
