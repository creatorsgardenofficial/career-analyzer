import { z } from "zod";

const trimmedString = (max: number, message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .max(max, `${max}文字以内で入力してください`);

const optionalTrimmedString = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `${max}文字以内で入力してください`)
    .optional()
    .transform((value) => (value === "" ? undefined : value));

const passwordSchema = z
  .string()
  .min(8, "パスワードは8文字以上で入力してください")
  .max(128, "パスワードは128文字以内で入力してください")
  .regex(/[a-zA-Z]/, "パスワードには英字を含めてください")
  .regex(/[0-9]/, "パスワードには数字を含めてください");

export const registerSchema = z.object({
  name: trimmedString(50, "氏名を入力してください"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("有効なメールアドレスを入力してください")
    .max(254),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("有効なメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("有効なメールアドレスを入力してください"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "トークンが不正です"),
    password: passwordSchema,
    confirmPassword: z.string().min(8, "確認用パスワードを入力してください"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export const analysisAnswersSchema = z.object({
  answers: z.record(z.string(), z.number().int().min(1).max(5)),
});

export const futureAnalysisInputSchema = z.object({
  targetEngineerType: trimmedString(
    200,
    "なりたいエンジニア像を入力してください",
  ),
  interestedTechnologies: optionalTrimmedString(500),
  preferredWorkStyle: optionalTrimmedString(300),
  weakTasks: optionalTrimmedString(500),
  avoidTasks: optionalTrimmedString(500),
  preferredProjects: optionalTrimmedString(500),
  targetSalary: optionalTrimmedString(100),
  studyTime: optionalTrimmedString(200),
  notes: optionalTrimmedString(2000),
});

export const projectPreparationInputSchema = z.object({
  projectName: optionalTrimmedString(200),
  projectDescription: trimmedString(5000, "案件概要を入力してください"),
  requiredSkills: optionalTrimmedString(1000),
  preferredSkills: optionalTrimmedString(1000),
  workProcess: optionalTrimmedString(500),
  technologies: optionalTrimmedString(1000),
  desiredPersonality: optionalTrimmedString(1000),
  workStyle: optionalTrimmedString(300),
  interviewDate: optionalTrimmedString(20),
  concerns: optionalTrimmedString(2000),
});

export const skillSheetUpdateSchema = z.object({
  id: z.string(),
  structuredDataJson: z.record(z.string(), z.unknown()),
  title: optionalTrimmedString(200),
});

export type StructuredSkillSheet = {
  name?: string;
  experience_years?: string;
  nearest_station?: string;
  skills?: {
    languages?: string[];
    frameworks?: string[];
    databases?: string[];
    tools?: string[];
    cloud?: string[];
    os?: string[];
  };
  processes?: string[];
  qualifications?: string[];
  projects?: Array<{
    period?: string;
    summary?: string;
    role?: string;
    team_size?: string;
    tasks?: string[];
    technologies?: string[];
  }>;
  strengths_from_skill_sheet?: string[];
  weaknesses_from_skill_sheet?: string[];
  preferred_tasks?: string[];
  weak_tasks?: string[];
  self_pr?: string;
  career_keywords?: string[];
};

export type ProjectQuestionItem = {
  question: string;
  answer: string;
  intent?: string;
  avoid?: string;
};

export type ReverseQuestionItem = {
  question: string;
  purpose?: string;
};

export type SelfIntroductionContent = {
  short: string;
  standard: string;
};

export function parseSelfIntroduction(value: string): SelfIntroductionContent {
  try {
    const parsed = JSON.parse(value) as Partial<SelfIntroductionContent>;
    if (parsed.short && parsed.standard) {
      return { short: parsed.short, standard: parsed.standard };
    }
  } catch {
    // legacy plain text
  }
  return { short: value, standard: value };
}

export function parseProjectQuestions(value: unknown): ProjectQuestionItem[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const record = item as Partial<ProjectQuestionItem>;
    return {
      question: record.question ?? "",
      answer: record.answer ?? "",
      intent: record.intent,
      avoid: record.avoid,
    };
  });
}

export function parseReverseQuestions(value: unknown): ReverseQuestionItem[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    if (typeof item === "string") {
      return { question: item };
    }
    const record = item as Partial<ReverseQuestionItem>;
    return {
      question: record.question ?? "",
      purpose: record.purpose,
    };
  });
}
