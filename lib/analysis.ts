import type { DbQuestion } from "@/lib/questions";

export const CATEGORY_DEFINITIONS = [
  { key: "communication", label: "コミュニケーション力", count: 10 },
  { key: "reporting", label: "報連相力", count: 10 },
  { key: "logic", label: "論理的思考力", count: 5 },
  { key: "specUnderstanding", label: "仕様理解力", count: 5 },
  { key: "learning", label: "学習意欲", count: 5 },
  { key: "selfDriven", label: "自走力", count: 5 },
  { key: "teamwork", label: "チーム適性", count: 5 },
  { key: "design", label: "設計適性", count: 5 },
  { key: "implementation", label: "実装適性", count: 5 },
  { key: "testing", label: "テスト適性", count: 5 },
  { key: "clientNegotiation", label: "顧客折衝適性", count: 5 },
  { key: "stressTolerance", label: "ストレス耐性", count: 5 },
  { key: "writing", label: "文章化能力", count: 5 },
  { key: "interview", label: "面談対応力", count: 5 },
  { key: "leadership", label: "リーダー適性", count: 5 },
  { key: "career", label: "キャリア志向性", count: 15 },
] as const;

export type CategoryKey = (typeof CATEGORY_DEFINITIONS)[number]["key"];

export const LIKERT_OPTIONS = [
  { value: 5, label: "非常に当てはまる" },
  { value: 4, label: "やや当てはまる" },
  { value: 3, label: "どちらとも言えない" },
  { value: 2, label: "あまり当てはまらない" },
  { value: 1, label: "全く当てはまらない" },
] as const;

export const CATEGORY_LABELS = Object.fromEntries(
  CATEGORY_DEFINITIONS.map((c) => [c.key, c.label]),
) as Record<CategoryKey, string>;

export function calculateCategoryScores(
  answers: Record<string, number>,
  questions: DbQuestion[],
): Record<CategoryKey, number> {
  const sums: Partial<Record<CategoryKey, number>> = {};
  const counts: Partial<Record<CategoryKey, number>> = {};

  for (const question of questions) {
    const answer = answers[question.id];
    if (!answer) continue;
    sums[question.categoryKey] = (sums[question.categoryKey] ?? 0) + answer;
    counts[question.categoryKey] = (counts[question.categoryKey] ?? 0) + 1;
  }

  const scores = {} as Record<CategoryKey, number>;

  for (const category of CATEGORY_DEFINITIONS) {
    const sum = sums[category.key] ?? 0;
    const count = counts[category.key] ?? category.count;
    const maxScore = count * 5;
    scores[category.key] =
      maxScore > 0 ? Math.round((sum / maxScore) * 100) : 0;
  }

  return scores;
}

export function getStrengthsAndWeaknesses(
  scores: Record<CategoryKey, number>,
): { strengths: string[]; weaknesses: string[] } {
  const sorted = CATEGORY_DEFINITIONS.map((c) => ({
    label: c.label,
    score: scores[c.key] ?? 0,
  })).sort((a, b) => b.score - a.score);

  return {
    strengths: sorted.slice(0, 3).map((s) => s.label),
    weaknesses: sorted.slice(-3).reverse().map((s) => s.label),
  };
}

export function getTotalScore(scores: Record<CategoryKey, number>): number {
  const values = Object.values(scores);
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export const FIT_PROFILES = {
  ses: ["reporting", "communication", "stressTolerance"],
  inHouse: ["implementation", "learning", "selfDriven"],
  contract: ["teamwork", "clientNegotiation", "specUnderstanding"],
  pm: ["leadership", "clientNegotiation", "writing"],
  pl: ["reporting", "design", "leadership"],
  pg: ["implementation", "learning", "testing"],
  ai: ["logic", "learning", "specUnderstanding"],
  mobile: ["implementation", "design", "interview"],
  infra: ["reporting", "stressTolerance", "testing"],
} as const satisfies Record<string, readonly CategoryKey[]>;

export function getFitScores(scores: Record<CategoryKey, number>) {
  return Object.entries(FIT_PROFILES).map(([key, categories]) => {
    const avg =
      categories.reduce((sum, cat) => sum + (scores[cat] ?? 0), 0) /
      categories.length;
    return { key, label: FIT_LABELS[key], score: Math.round(avg) };
  });
}

export const FIT_LABELS: Record<string, string> = {
  ses: "SES向き",
  inHouse: "自社開発向き",
  contract: "受託開発向き",
  pm: "PM向き",
  pl: "PL向き",
  pg: "PG向き",
  ai: "AIエンジニア向き",
  mobile: "モバイル向き",
  infra: "インフラ向き",
};

export function extractCategoryScores(
  json: Record<string, unknown>,
): Record<CategoryKey, number> {
  const scores = {} as Record<CategoryKey, number>;
  for (const category of CATEGORY_DEFINITIONS) {
    const value = json[category.key];
    if (typeof value === "number") {
      scores[category.key] = value;
    }
  }
  return scores;
}

export function extractFitInsights(json: Record<string, unknown>) {
  const suitableProjects =
    (json.suitableProjects as Array<{
      label: string;
      score: number;
      reason: string;
    }>) ?? [];
  const unsuitableProjects =
    (json.unsuitableProjects as Array<{
      label: string;
      score: number;
      reason: string;
    }>) ?? [];
  const cautions = (json.cautions as string[]) ?? [];
  return { suitableProjects, unsuitableProjects, cautions };
}

export function getProjectFitInsights(scores: Record<CategoryKey, number>) {
  const fitScores = getFitScores(scores).sort((a, b) => b.score - a.score);
  const { weaknesses } = getStrengthsAndWeaknesses(scores);

  return {
    suitableProjects: fitScores.slice(0, 3).map((f) => ({
      label: f.label,
      score: f.score,
      reason: `${f.label}の適性スコアが高いため、関連案件で力を発揮しやすい傾向があります。`,
    })),
    unsuitableProjects: fitScores.slice(-3).reverse().map((f) => ({
      label: f.label,
      score: f.score,
      reason: `${f.label}の適性スコアが相対的に低いため、負荷の高い案件では苦戦する可能性があります。`,
    })),
    cautions: [
      ...weaknesses.map(
        (w) => `${w}が相対的に低めです。面談前に具体例と改善策を準備しておくと安心です。`,
      ),
      "スキルシートにない経験を面談で主張しないよう注意してください。",
    ],
  };
}
