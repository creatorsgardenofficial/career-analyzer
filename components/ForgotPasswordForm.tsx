"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  requestPasswordResetAction,
  type PasswordResetActionState,
} from "@/app/actions/passwordReset";
import { FormButton } from "@/components/FormButton";

const initialState: PasswordResetActionState = {};

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordResetAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          登録メールアドレス
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-zinc-300 px-3 py-2"
        />
      </div>

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      {state.success && (
        <div className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">
          <p>{state.success}</p>
          {state.resetUrl && (
            <p className="mt-2 break-all">
              <Link href={state.resetUrl} className="text-blue-600 hover:underline">
                {state.resetUrl}
              </Link>
            </p>
          )}
        </div>
      )}

      <FormButton pending={pending}>再設定リンクを送信</FormButton>

      <p className="text-center text-sm text-zinc-600">
        <Link href="/login" className="text-blue-600 hover:underline">
          ログインに戻る
        </Link>
      </p>
    </form>
  );
}
