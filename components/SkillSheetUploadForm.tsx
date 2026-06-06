"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SkillSheetUploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("ファイルを選択してください");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/skill-sheet/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { id?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "アップロードに失敗しました");
      }

      if (data.id) {
        router.push(`/skill-sheet/result/${data.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "アップロードに失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6"
    >
      <div>
        <label htmlFor="file" className="mb-2 block text-sm font-medium">
          Excelスキルシート (.xlsx / .xls)
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <label
            htmlFor="file"
            className="inline-flex cursor-pointer items-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-zinc-50"
          >
            ファイルを選択
          </label>
          <span className="text-sm text-zinc-600">
            {file ? file.name : "選択されていません"}
          </span>
        </div>
        <input
          id="file"
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="sr-only"
        />
        <p className="mt-2 text-xs text-zinc-500">最大5MBまでアップロード可能です</p>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "読み取り中..." : "読み取り実行"}
      </button>
    </form>
  );
}
