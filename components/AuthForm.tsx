"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  loginAction,
  registerAction,
  type AuthActionState,
} from "@/app/actions/auth";
import { FormButton } from "@/components/FormButton";

const initialState: AuthActionState = {};

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const action = mode === "login" ? loginAction : registerAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {mode === "register" && (
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            氏名
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          メールアドレス
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-zinc-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          パスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={mode === "register" ? 8 : 1}
          className="w-full rounded-md border border-zinc-300 px-3 py-2"
        />
      </div>

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <FormButton pending={pending}>
        {mode === "login" ? "ログイン" : "新規登録"}
      </FormButton>

      {mode === "login" && (
        <p className="text-center text-sm">
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            パスワードをお忘れの方
          </Link>
        </p>
      )}

      <p className="text-center text-sm text-zinc-600">
        {mode === "login" ? (
          <>
            アカウントをお持ちでない方は{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              新規登録
            </Link>
          </>
        ) : (
          <>
            既にアカウントをお持ちの方は{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              ログイン
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
