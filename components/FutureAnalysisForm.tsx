"use client";

import { useActionState } from "react";
import {
  createFutureAnalysisAction,
  type FutureAnalysisActionState,
} from "@/app/actions/futureAnalysis";
import { FormButton } from "@/components/FormButton";

const initialState: FutureAnalysisActionState = {};

export function FutureAnalysisForm() {
  const [state, formAction, pending] = useActionState(
    createFutureAnalysisAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6"
    >
      <Field label="なりたいエンジニア像 *" name="targetEngineerType" required />
      <Field label="興味のある技術" name="interestedTechnologies" />
      <Field label="希望する働き方" name="preferredWorkStyle" />
      <Field label="苦手な業務" name="weakTasks" />
      <Field label="避けたい業務" name="avoidTasks" />
      <Field label="希望案件" name="preferredProjects" />
      <Field label="目標年収" name="targetSalary" />
      <Field
        label="学習に使える時間（週あたり）"
        name="studyTime"
        placeholder="例: 週5時間、平日1時間＋休日2時間"
        helperText="1週間で学習に使える時間の目安を入力してください。"
      />
      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium">
          補足
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          className="w-full rounded-md border border-zinc-300 px-3 py-2"
        />
      </div>

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <FormButton pending={pending}>分析実行</FormButton>
    </form>
  );
}

function Field({
  label,
  name,
  required,
  placeholder,
  helperText,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-md border border-zinc-300 px-3 py-2"
      />
      {helperText && <p className="mt-1 text-xs text-zinc-500">{helperText}</p>}
    </div>
  );
}
