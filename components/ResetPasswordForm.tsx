"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  resetPasswordAction,
  type PasswordResetActionState,
} from "@/app/actions/passwordReset";
import { FormButton } from "@/components/FormButton";

const initialState: PasswordResetActionState = {};

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, formAction, pending] = useActionState(
    resetPasswordAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          新しいパスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="w-full rounded-md border border-zinc-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium">
          新しいパスワード（確認）
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          className="w-full rounded-md border border-zinc-300 px-3 py-2"
        />
      </div>

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <FormButton pending={pending}>パスワードを更新</FormButton>

      <p className="text-center text-sm text-zinc-600">
        <Link href="/login" className="text-blue-600 hover:underline">
          ログインに戻る
        </Link>
      </p>
    </form>
  );
}
