"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import {
  createAnalysisAction,
  type AnalysisActionState,
} from "@/app/actions/analysis";
import { FormButton } from "@/components/FormButton";
import { LIKERT_OPTIONS } from "@/lib/analysis";
import type { DbQuestion } from "@/lib/questions";

const STORAGE_KEY = "ses-analysis-draft";
const initialState: AnalysisActionState = {};

type AnalysisFormProps = {
  questions: DbQuestion[];
};

type AnalysisDraft = {
  answers: Record<string, number>;
  currentIndex: number;
};

function isAnalysisDraft(value: unknown): value is AnalysisDraft {
  return (
    typeof value === "object" &&
    value !== null &&
    "answers" in value &&
    typeof (value as AnalysisDraft).answers === "object" &&
    (value as AnalysisDraft).answers !== null
  );
}

function readDraft(questionCount: number): AnalysisDraft {
  if (typeof window === "undefined") {
    return { answers: {}, currentIndex: 0 };
  }

  try {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("restart") === "1") {
      localStorage.removeItem(STORAGE_KEY);
      return { answers: {}, currentIndex: 0 };
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return { answers: {}, currentIndex: 0 };
    }

    const parsed = JSON.parse(saved) as unknown;

    if (isAnalysisDraft(parsed)) {
      return {
        answers: parsed.answers ?? {},
        currentIndex: Math.min(
          Math.max(parsed.currentIndex ?? 0, 0),
          Math.max(questionCount - 1, 0),
        ),
      };
    }

    // Older drafts stored only answers. Keep them usable and resume at first unanswered question.
    const legacyAnswers =
      typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, number>)
        : {};
    const firstUnansweredIndex = Math.max(
      0,
      Object.keys(legacyAnswers).length < questionCount
        ? Object.keys(legacyAnswers).length
        : 0,
    );
    return {
      answers: legacyAnswers,
      currentIndex: Math.min(firstUnansweredIndex, Math.max(questionCount - 1, 0)),
    };
  } catch {
    return { answers: {}, currentIndex: 0 };
  }
}

export function AnalysisForm({ questions }: AnalysisFormProps) {
  const [state, formAction, pending] = useActionState(
    createAnalysisAction,
    initialState,
  );
  const [draft] = useState(() => readDraft(questions.length));
  const [currentIndex, setCurrentIndex] = useState(draft.currentIndex);
  const [answers, setAnswers] = useState<Record<string, number>>(draft.answers);

  const currentQuestion = questions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);
  const answeredCount = useMemo(
    () => questions.filter((q) => answers[q.id]).length,
    [answers, questions],
  );
  const missingCount = questions.length - answeredCount;
  const isComplete = missingCount === 0;

  if (!currentQuestion) {
    return null;
  }

  function saveDraft(nextAnswers: Record<string, number>, index = currentIndex) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ answers: nextAnswers, currentIndex: index }),
    );
  }

  function handleSelect(value: number) {
    const next = { ...answers, [currentQuestion.id]: value };
    setAnswers(next);
    saveDraft(next);
  }

  function goToQuestion(index: number) {
    setCurrentIndex(index);
    saveDraft(answers, index);
  }

  function handleSaveDraft() {
    saveDraft(answers, currentIndex);
    alert(`質問 ${currentIndex + 1} から再開できるよう一時保存しました`);
  }

  function handleRestart() {
    if (
      answeredCount > 0 &&
      !confirm("現在の回答内容を削除して、最初から回答し直しますか？")
    ) {
      return;
    }

    setAnswers({});
    setCurrentIndex(0);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="answers" value={JSON.stringify(answers)} />

      <div className="rounded-lg border border-zinc-200 bg-white p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-1 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <span>
            質問 {currentIndex + 1} / {questions.length}
          </span>
          <span>回答済み: {answeredCount}件</span>
        </div>

        <div className="mb-4 h-2 overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mb-2 text-xs text-blue-700">{currentQuestion.categoryLabel}</p>
        <h2 className="mb-6 text-base font-semibold leading-7 sm:text-lg">
          {currentQuestion.text}
        </h2>

        <div className="space-y-3">
          {LIKERT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-3 rounded-md border px-3 py-3 sm:items-center sm:px-4 ${
                answers[currentQuestion.id] === option.value
                  ? "border-blue-600 bg-blue-50"
                  : "border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              <input
                type="radio"
                name={currentQuestion.id}
                value={option.value}
                checked={answers[currentQuestion.id] === option.value}
                onChange={() => handleSelect(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="grid gap-3 sm:flex sm:flex-wrap">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => goToQuestion(currentIndex - 1)}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm disabled:opacity-50"
        >
          前へ
        </button>
        <button
          type="button"
          disabled={currentIndex >= questions.length - 1}
          onClick={() => goToQuestion(currentIndex + 1)}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm disabled:opacity-50"
        >
          次へ
        </button>
        <button
          type="button"
          onClick={handleSaveDraft}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm"
        >
          一時保存
        </button>
        <button
          type="button"
          onClick={handleRestart}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
        >
          最初から回答
        </button>
        <FormButton pending={pending} disabled={!isComplete}>
          回答完了
        </FormButton>
      </div>
    </form>
  );
}
