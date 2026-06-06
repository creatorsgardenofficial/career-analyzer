"use server";

import bcrypt from "bcryptjs";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { getSafeErrorMessage } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitMessage } from "@/lib/rate-limit";
import { getSession } from "@/lib/session";
import { loginSchema, registerSchema } from "@/lib/validations";

export type AuthActionState = {
  error?: string;
  success?: string;
};

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "入力内容を確認してください" };
  }

  const rateLimit = checkRateLimit({
    key: `register:${parsed.data.email}`,
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (!rateLimit.allowed) {
    return { error: rateLimitMessage(rateLimit.retryAfterMs) };
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (existing) {
      return { error: "このメールアドレスは既に登録されています" };
    }

    const hashed = await bcrypt.hash(parsed.data.password, 10);
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: hashed,
      },
    });

    const session = await getSession();
    session.user = { id: user.id, name: user.name, email: user.email };
    await session.save();

    redirect("/dashboard");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      error: getSafeErrorMessage(error, "登録処理中にエラーが発生しました"),
    };
  }
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "入力内容を確認してください" };
  }

  const rateLimit = checkRateLimit({
    key: `login:${parsed.data.email}`,
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });
  if (!rateLimit.allowed) {
    return { error: rateLimitMessage(rateLimit.retryAfterMs) };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (!user) {
      return { error: "メールアドレスまたはパスワードが正しくありません" };
    }

    const valid = await bcrypt.compare(parsed.data.password, user.password);
    if (!valid) {
      return { error: "メールアドレスまたはパスワードが正しくありません" };
    }

    const session = await getSession();
    session.user = { id: user.id, name: user.name, email: user.email };
    await session.save();

    redirect("/dashboard");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      error: getSafeErrorMessage(error, "ログイン処理中にエラーが発生しました"),
    };
  }
}

export async function logoutAction() {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}
