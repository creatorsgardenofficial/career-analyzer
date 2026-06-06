"use client";

import { useActionState } from "react";
import {
  createProjectPreparationAction,
  type ProjectPreparationActionState,
} from "@/app/actions/projectPreparation";
import { FormButton } from "@/components/FormButton";

const initialState: ProjectPreparationActionState = {};

export function ProjectPreparationForm() {
  const [state, formAction, pending] = useActionState(
    createProjectPreparationAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6">
      <Field label="案件名" name="projectName" />
      <div>
        <label htmlFor="projectDescription" className="mb-1 block text-sm font-medium">
          案件概要 *
        </label>
        <textarea
          id="projectDescription"
          name="projectDescription"
          required
          rows={5}
          className="w-full rounded-md border border-zinc-300 px-3 py-2"
        />
      </div>
      <Field label="必須スキル" name="requiredSkills" />
      <Field label="尚可スキル" name="preferredSkills" />
      <Field label="作業工程" name="workProcess" />
      <Field label="使用技術" name="technologies" />
      <Field label="求める人物像" name="desiredPersonality" />
      <Field label="勤務形態" name="workStyle" />
      <Field label="面談予定日" name="interviewDate" type="date" />
      <div>
        <label htmlFor="concerns" className="mb-1 block text-sm font-medium">
          不安点
        </label>
        <textarea
          id="concerns"
          name="concerns"
          rows={3}
          className="w-full rounded-md border border-zinc-300 px-3 py-2"
        />
      </div>

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <FormButton pending={pending}>対策生成</FormButton>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="w-full rounded-md border border-zinc-300 px-3 py-2"
      />
    </div>
  );
}
