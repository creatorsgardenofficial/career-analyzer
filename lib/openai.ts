import OpenAI from "openai";
import type { CategoryKey } from "@/lib/analysis";
import { CATEGORY_LABELS } from "@/lib/analysis";
import type {
  StructuredSkillSheet,
  futureAnalysisInputSchema,
  projectPreparationInputSchema,
} from "@/lib/validations";
import type { z } from "zod";

type FutureInput = z.infer<typeof futureAnalysisInputSchema>;
type ProjectInput = z.infer<typeof projectPreparationInputSchema>;

function hasOpenAiKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

function getClient(): OpenAI | null {
  if (!hasOpenAiKey()) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function shouldUseMock(): boolean {
  return !hasOpenAiKey() && process.env.NODE_ENV !== "production";
}

function requireOpenAi(): OpenAI {
  const client = getClient();
  if (!client) {
    throw new Error(
      "OPENAI_API_KEY が設定されていません。環境変数を設定してください。",
    );
  }
  return client;
}

async function chatCompletion(system: string, user: string): Promise<string> {
  if (shouldUseMock()) {
    return `[開発用モック]\n${user.slice(0, 500)}...`;
  }

  const client = requireOpenAi();
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content?.trim() ?? "";
}

export async function generatePersonalAnalysisComment(params: {
  categoryScores: Record<CategoryKey, number>;
  strengths: string[];
  weaknesses: string[];
  skillSheetSummary?: string;
}): Promise<string> {
  const system = `あなたはSESエンジニア向けのキャリア分析アドバイザーです。
以下の回答傾向とスキルシート情報をもとに、ユーザーが自己理解を深めるための分析コメントを作成してください。
条件:
- 厳しすぎず、現実的に書く
- 人を点数化・序列化する表現は避ける
- 「向いている案件」「向いていない案件」「避けた方がよい案件」は書かない
- 「注意点」という見出しや警告調の表現は使わない
- 弱みは否定ではなく、伸ばしたい課題として書く
- 抽象論ではなく具体的に書く
- 経験していないことを経験済みのように書かない
- 回答傾向から読み取れる「仕事で出やすい行動」「周囲から見えやすい印象」「成長の打ち手」まで踏み込む
- 1つの見出しにつき、2〜4個の箇条書きまたは短い段落で詳しく書く
- 全体で900〜1400字程度にする
- Markdown形式で、見出しは必ず「## 」から始める
- 箇条書きは「- 」を使う`;

  const scoreText = Object.entries(params.categoryScores)
    .map(([key, score]) => `${CATEGORY_LABELS[key as CategoryKey]}: ${score}`)
    .join("\n");

  const user = `カテゴリ別の回答傾向:
${scoreText}

強み: ${params.strengths.join("、")}
伸ばしたい課題: ${params.weaknesses.join("、")}

スキルシート要約:
${params.skillSheetSummary ?? "未登録"}

以下の見出しで日本語で回答してください:
## 全体像
回答傾向から見える仕事への向き合い方を、本人が納得しやすい言葉で説明してください。

## 強みとして表れた行動
強みが実務でどのような行動として出やすいか、具体例を交えて説明してください。

## 伸ばしたいテーマ
弱みを否定せず、伸ばすと仕事が進めやすくなるテーマとして説明してください。

## 明日から試せる行動
日々の業務や学習で実行しやすい行動を、具体的に3〜5個提案してください。

## 振り返り質問
本人が自己理解を深めるための質問を3〜5個挙げてください。`;

  return chatCompletion(system, user);
}

export async function structureSkillSheetText(
  extractedText: string,
): Promise<{ structured: StructuredSkillSheet; summary: string }> {
  const system = `あなたはSESエンジニアのスキルシート解析アシスタントです。
Excelから抽出したテキストを読み取り、JSON形式で構造化してください。
事実ベースで抽出し、推測で経験を盛らないでください。
必ず有効なJSONのみを返してください。`;

  const user = `以下のスキルシートテキストを構造化してください。

${extractedText.slice(0, 12000)}

JSON形式:
{
  "name": "",
  "experience_years": "",
  "skills": { "languages": [], "frameworks": [], "databases": [], "tools": [], "cloud": [], "os": [] },
  "processes": [],
  "qualifications": [],
  "projects": [{ "period": "", "summary": "", "role": "", "team_size": "", "tasks": [], "technologies": [] }],
  "strengths_from_skill_sheet": [],
  "weaknesses_from_skill_sheet": [],
  "preferred_tasks": [],
  "weak_tasks": [],
  "career_keywords": []
}`;

  if (shouldUseMock()) {
    return {
      structured: {
        name: "（モック）ユーザー",
        experience_years: "3年",
        skills: {
          languages: ["Java", "TypeScript"],
          frameworks: ["Spring Boot", "Next.js"],
          databases: ["PostgreSQL"],
          tools: ["Git", "Docker"],
          cloud: ["AWS"],
          os: ["Linux", "Windows"],
        },
        processes: ["詳細設計", "実装", "単体テスト"],
        qualifications: ["基本情報技術者"],
        preferred_tasks: ["API実装"],
        weak_tasks: ["インフラ構築"],
        projects: [
          {
            period: "2023-2024",
            summary: "Webアプリ開発",
            role: "メンバー",
            team_size: "5名",
            tasks: ["API実装", "画面改修"],
            technologies: ["Java", "React"],
          },
        ],
        strengths_from_skill_sheet: ["実装経験", "チーム開発"],
        weaknesses_from_skill_sheet: ["設計経験が浅い"],
        career_keywords: ["バックエンド", "Web開発"],
      },
      summary: "Java/TypeScriptを中心としたWeb開発経験を持つエンジニアです。",
    };
  }

  const raw = await chatCompletion(system, user);
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("スキルシートの構造化に失敗しました");
  }

  const structured = JSON.parse(jsonMatch[0]) as StructuredSkillSheet;
  const summary = `経験年数: ${structured.experience_years ?? "不明"}。言語: ${structured.skills?.languages?.join("、") ?? "不明"}`;

  return { structured, summary };
}

export async function generateFutureAnalysis(params: {
  input: FutureInput;
  categoryScores: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  skillSheet?: StructuredSkillSheet | null;
}): Promise<string> {
  const system = `あなたはSESエンジニア向けのキャリアコーチです。
個人分析結果とスキルシートを必ず踏まえて、1年後・2年後・3年後の成長ロードマップを作成してください。
現実的で実行可能なアドバイスにしてください。
条件:
- 個人分析の強み・伸ばしたい項目を、学習方針や仕事の進め方に反映する
- スキルシートに記載された経験年数、使用技術、担当工程、プロジェクト経験を根拠として扱う
- スキルシートにない経験を経験済みのように書かない
- 個人分析またはスキルシートが未登録の場合は、未登録であることを前提に、入力内容から分かる範囲で提案する`;

  const user = `なりたいエンジニア像: ${params.input.targetEngineerType}
興味技術: ${params.input.interestedTechnologies ?? ""}
希望働き方: ${params.input.preferredWorkStyle ?? ""}
苦手業務: ${params.input.weakTasks ?? ""}
避けたい業務: ${params.input.avoidTasks ?? ""}
希望案件: ${params.input.preferredProjects ?? ""}
目標年収: ${params.input.targetSalary ?? ""}
週あたりの学習時間: ${params.input.studyTime ?? ""}
補足: ${params.input.notes ?? ""}

個人分析の回答傾向: ${JSON.stringify(params.categoryScores)}
強み: ${params.strengths.join("、")}
伸ばしたい項目: ${params.weaknesses.join("、")}
スキルシート: ${JSON.stringify(params.skillSheet ?? {})}

以下の見出しで日本語で回答:
## 1年後
## 2年後
## 3年後
## 学習優先順位
## おすすめ案件傾向`;

  return chatCompletion(system, user);
}

export type ProjectPreparationResult = {
  selfIntroduction: string;
  questions: Array<{ question: string; answer: string }>;
  reverseQuestions: string[];
  fullResultText: string;
};

export async function generateProjectPreparation(params: {
  input: ProjectInput;
  categoryScores: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  skillSheet?: StructuredSkillSheet | null;
}): Promise<ProjectPreparationResult> {
  const system = `あなたはSES案件面談の対策担当です。
以下の情報をもとに、案件面談で使える自己紹介文、想定質問10件、回答例10件、逆質問5件を作成してください。
条件:
- 経歴を盛りすぎない
- 個人分析の強み・伸ばしたい項目を、自己紹介や回答例の表現に反映する
- スキルシートの実務経験、使用技術、担当工程、プロジェクト内容を回答の根拠にする
- 弱みや不安点を正直に扱いつつ前向きな表現に変換する
- 案件概要に合う内容にする
- 面談でそのまま話せる自然な文章にする
- 回答は1問あたり30秒〜1分程度
- 経験していないことを経験済みのように書かない
- スキルシートにない技術は「経験済み」ではなく「学習中」「キャッチアップ可能」などの表現にする

必ず有効なJSONのみを返してください。`;

  const user = `案件名: ${params.input.projectName ?? ""}
案件概要: ${params.input.projectDescription}
必須スキル: ${params.input.requiredSkills ?? ""}
尚可スキル: ${params.input.preferredSkills ?? ""}
作業工程: ${params.input.workProcess ?? ""}
使用技術: ${params.input.technologies ?? ""}
求める人物像: ${params.input.desiredPersonality ?? ""}
勤務形態: ${params.input.workStyle ?? ""}
面談予定日: ${params.input.interviewDate ?? ""}
不安点: ${params.input.concerns ?? ""}

個人分析の回答傾向: ${JSON.stringify(params.categoryScores)}
強み: ${params.strengths.join("、")}
伸ばしたい項目: ${params.weaknesses.join("、")}
スキルシート: ${JSON.stringify(params.skillSheet ?? {})}

JSON形式:
{
  "selfIntroduction": "",
  "questions": [{ "question": "", "answer": "" }],
  "reverseQuestions": [""]
}`;

  if (shouldUseMock()) {
    const questions = Array.from({ length: 10 }, (_, i) => ({
      question: `想定質問${i + 1}: これまでの開発経験を教えてください`,
      answer: `回答例${i + 1}: これまでWebアプリ開発を中心に担当してきました。`,
    }));
    const reverseQuestions = Array.from(
      { length: 5 },
      (_, i) => `逆質問${i + 1}: 参画後の最初の担当業務を教えてください`,
    );
    const selfIntroduction =
      "はじめまして。これまでSES案件でWebアプリ開発を担当してきました。";
    return {
      selfIntroduction,
      questions,
      reverseQuestions,
      fullResultText: `${selfIntroduction}\n\n${questions.map((q) => `${q.question}\n${q.answer}`).join("\n\n")}`,
    };
  }

  const raw = await chatCompletion(system, user);
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("案件対策の生成に失敗しました");
  }

  const parsed = JSON.parse(jsonMatch[0]) as {
    selfIntroduction: string;
    questions: Array<{ question: string; answer: string }>;
    reverseQuestions: string[];
  };

  const fullResultText = [
    parsed.selfIntroduction,
    "",
    "## 想定質問と回答例",
    ...parsed.questions.flatMap((q) => [`Q: ${q.question}`, `A: ${q.answer}`, ""]),
    "## 逆質問",
    ...parsed.reverseQuestions.map((q, i) => `${i + 1}. ${q}`),
  ].join("\n");

  return {
    selfIntroduction: parsed.selfIntroduction,
    questions: parsed.questions,
    reverseQuestions: parsed.reverseQuestions,
    fullResultText,
  };
}

export const structureSkillSheet = structureSkillSheetText;
