"use server";

import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { getSafeErrorMessage } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitMessage } from "@/lib/rate-limit";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validations";

export type PasswordResetActionState = {
  error?: string;
  success?: string;
  resetUrl?: string;
};

export async function requestPasswordResetAction(
  _prevState: PasswordResetActionState,
  formData: FormData,
): Promise<PasswordResetActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "入力内容を確認してください" };
  }

  const rateLimit = checkRateLimit({
    key: `password-reset:${parsed.data.email}`,
    limit: 5,
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
      return {
        success:
          "入力されたメールアドレス宛に再設定手順を送信しました（登録がある場合）。",
      };
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    const baseUrl =
      process.env.APP_BASE_URL?.trim() || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    if (process.env.NODE_ENV === "development") {
      return {
        success: "開発環境のため、以下のリンクからパスワードを再設定できます。",
        resetUrl,
      };
    }

    return {
      success:
        "パスワード再設定用の手順を送信しました。メールをご確認ください。",
    };
  } catch (error) {
    console.error(error);
    return {
      error: getSafeErrorMessage(
        error,
        "パスワード再設定の処理中にエラーが発生しました",
      ),
    };
  }
}

export async function resetPasswordAction(
  _prevState: PasswordResetActionState,
  formData: FormData,
): Promise<PasswordResetActionState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "入力内容を確認してください" };
  }

  const rateLimit = checkRateLimit({
    key: `reset-password:${parsed.data.token}`,
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (!rateLimit.allowed) {
    return { error: rateLimitMessage(rateLimit.retryAfterMs) };
  }

  try {
    const record = await prisma.passwordResetToken.findUnique({
      where: { token: parsed.data.token },
      include: { user: true },
    });

    if (!record || record.expiresAt < new Date()) {
      return { error: "再設定リンクが無効または期限切れです" };
    }

    const hashed = await bcrypt.hash(parsed.data.password, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { password: hashed },
      }),
      prisma.passwordResetToken.delete({ where: { id: record.id } }),
    ]);

    redirect("/login");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return {
      error: getSafeErrorMessage(error, "パスワードの更新に失敗しました"),
    };
  }
}
