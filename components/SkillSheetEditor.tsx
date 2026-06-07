"use client";

import { useActionState, useState } from "react";
import {
  updateSkillSheetAction,
  type SkillSheetActionState,
} from "@/app/actions/skillSheet";
import { FormButton } from "@/components/FormButton";
import type { StructuredSkillSheet } from "@/lib/validations";

const initialState: SkillSheetActionState = {};

type SkillSheetEditorProps = {
  id: string;
  initialData: StructuredSkillSheet;
  title?: string | null;
};

function toCsv(values?: string[]) {
  return (values ?? []).join(", ");
}

function fromCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const emptyProject = {
  period: "",
  summary: "",
  role: "",
  team_size: "",
  tasks: [] as string[],
  technologies: [] as string[],
};

export function SkillSheetEditor({
  id,
  initialData,
  title,
}: SkillSheetEditorProps) {
  const [data, setData] = useState<StructuredSkillSheet>(initialData);
  const [state, formAction, pending] = useActionState(
    updateSkillSheetAction,
    initialState,
  );

  function updateSkills(
    key: keyof NonNullable<StructuredSkillSheet["skills"]>,
    value: string,
  ) {
    setData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [key]: fromCsv(value),
      },
    }));
  }

  function updateProject(
    index: number,
    field: keyof typeof emptyProject,
    value: string,
  ) {
    setData((prev) => {
      const projects = [...(prev.projects ?? [])];
      const current = { ...emptyProject, ...projects[index] };
      if (field === "tasks" || field === "technologies") {
        current[field] = fromCsv(value);
      } else {
        current[field] = value;
      }
      projects[index] = current;
      return { ...prev, projects };
    });
  }

  function addProject() {
    setData((prev) => ({
      ...prev,
      projects: [...(prev.projects ?? []), { ...emptyProject }],
    }));
  }

  function removeProject(index: number) {
    setData((prev) => ({
      ...prev,
      projects: (prev.projects ?? []).filter((_, i) => i !== index),
    }));
  }

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="structuredDataJson" value={JSON.stringify(data)} />

      <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 sm:p-6">
        <h2 className="font-semibold">基本情報</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="氏名"
            value={data.name ?? ""}
            onChange={(value) => setData((prev) => ({ ...prev, name: value }))}
          />
          <TextField
            label="経験年数"
            value={data.experience_years ?? ""}
            onChange={(value) =>
              setData((prev) => ({ ...prev, experience_years: value }))
            }
          />
          <TextField
            label="最寄り駅"
            value={data.nearest_station ?? ""}
            onChange={(value) =>
              setData((prev) => ({ ...prev, nearest_station: value }))
            }
          />
          <div>
            <label className="mb-1 block text-sm font-medium">タイトル（任意）</label>
            <input
              name="title"
              defaultValue={title ?? ""}
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">自己PR</label>
          <textarea
            value={data.self_pr ?? ""}
            onChange={(e) =>
              setData((prev) => ({ ...prev, self_pr: e.target.value }))
            }
            rows={4}
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
          />
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 sm:p-6">
        <h2 className="font-semibold">技術スキル</h2>
        <TextField
          label="使用言語（カンマ区切り）"
          value={toCsv(data.skills?.languages)}
          onChange={(value) => updateSkills("languages", value)}
        />
        <TextField
          label="フレームワーク（カンマ区切り）"
          value={toCsv(data.skills?.frameworks)}
          onChange={(value) => updateSkills("frameworks", value)}
        />
        <TextField
          label="DB（カンマ区切り）"
          value={toCsv(data.skills?.databases)}
          onChange={(value) => updateSkills("databases", value)}
        />
        <TextField
          label="OS（カンマ区切り）"
          value={toCsv(data.skills?.os)}
          onChange={(value) => updateSkills("os", value)}
        />
        <TextField
          label="クラウド（カンマ区切り）"
          value={toCsv(data.skills?.cloud)}
          onChange={(value) => updateSkills("cloud", value)}
        />
        <TextField
          label="ツール（カンマ区切り）"
          value={toCsv(data.skills?.tools)}
          onChange={(value) => updateSkills("tools", value)}
        />
        <TextField
          label="担当工程（カンマ区切り）"
          value={toCsv(data.processes)}
          onChange={(value) =>
            setData((prev) => ({ ...prev, processes: fromCsv(value) }))
          }
        />
        <TextField
          label="資格（カンマ区切り）"
          value={toCsv(data.qualifications)}
          onChange={(value) =>
            setData((prev) => ({ ...prev, qualifications: fromCsv(value) }))
          }
        />
      </section>

      <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 sm:p-6">
        <h2 className="font-semibold">得意・苦手・キーワード</h2>
        <TextField
          label="得意業務（カンマ区切り）"
          value={toCsv(data.preferred_tasks ?? data.strengths_from_skill_sheet)}
          onChange={(value) =>
            setData((prev) => ({
              ...prev,
              preferred_tasks: fromCsv(value),
              strengths_from_skill_sheet: fromCsv(value),
            }))
          }
        />
        <TextField
          label="苦手業務（カンマ区切り）"
          value={toCsv(data.weak_tasks ?? data.weaknesses_from_skill_sheet)}
          onChange={(value) =>
            setData((prev) => ({
              ...prev,
              weak_tasks: fromCsv(value),
              weaknesses_from_skill_sheet: fromCsv(value),
            }))
          }
        />
        <TextField
          label="キャリアキーワード（カンマ区切り）"
          value={toCsv(data.career_keywords)}
          onChange={(value) =>
            setData((prev) => ({ ...prev, career_keywords: fromCsv(value) }))
          }
        />
      </section>

      <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-semibold">プロジェクト履歴</h2>
          <button
            type="button"
            onClick={addProject}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm"
          >
            プロジェクトを追加
          </button>
        </div>

        {(data.projects ?? []).map((project, index) => (
          <div
            key={index}
            className="space-y-3 rounded-md border border-zinc-100 bg-zinc-50 p-3 sm:p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">プロジェクト {index + 1}</p>
              <button
                type="button"
                onClick={() => removeProject(index)}
                className="text-sm text-red-600"
              >
                削除
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <TextField
                label="期間"
                value={project.period ?? ""}
                onChange={(value) => updateProject(index, "period", value)}
              />
              <TextField
                label="役割"
                value={project.role ?? ""}
                onChange={(value) => updateProject(index, "role", value)}
              />
              <TextField
                label="チーム人数"
                value={project.team_size ?? ""}
                onChange={(value) => updateProject(index, "team_size", value)}
              />
            </div>
            <TextField
              label="プロジェクト概要"
              value={project.summary ?? ""}
              onChange={(value) => updateProject(index, "summary", value)}
            />
            <TextField
              label="業務内容（カンマ区切り）"
              value={toCsv(project.tasks)}
              onChange={(value) => updateProject(index, "tasks", value)}
            />
            <TextField
              label="使用技術（カンマ区切り）"
              value={toCsv(project.technologies)}
              onChange={(value) => updateProject(index, "technologies", value)}
            />
          </div>
        ))}
      </section>

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          {state.success}
        </p>
      )}

      <FormButton pending={pending}>保存</FormButton>
    </form>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-zinc-300 px-3 py-2"
      />
    </div>
  );
}
