import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "氏名を入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(8, "パスワードは8文字以上で入力してください"),
});

export const loginSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "トークンが不正です"),
  password: z.string().min(8, "パスワードは8文字以上で入力してください"),
  confirmPassword: z.string().min(8, "確認用パスワードを入力してください"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "パスワードが一致しません",
  path: ["confirmPassword"],
});

export const analysisAnswersSchema = z.object({
  answers: z.record(z.string(), z.number().int().min(1).max(5)),
});

export const futureAnalysisInputSchema = z.object({
  targetEngineerType: z.string().min(1, "なりたいエンジニア像を入力してください"),
  interestedTechnologies: z.string().optional(),
  preferredWorkStyle: z.string().optional(),
  weakTasks: z.string().optional(),
  avoidTasks: z.string().optional(),
  preferredProjects: z.string().optional(),
  targetSalary: z.string().optional(),
  studyTime: z.string().optional(),
  notes: z.string().optional(),
});

export const projectPreparationInputSchema = z.object({
  projectName: z.string().optional(),
  projectDescription: z.string().min(1, "案件概要を入力してください"),
  requiredSkills: z.string().optional(),
  preferredSkills: z.string().optional(),
  workProcess: z.string().optional(),
  technologies: z.string().optional(),
  desiredPersonality: z.string().optional(),
  workStyle: z.string().optional(),
  interviewDate: z.string().optional(),
  concerns: z.string().optional(),
});

export const skillSheetUpdateSchema = z.object({
  id: z.string(),
  structuredDataJson: z.record(z.string(), z.unknown()),
  title: z.string().optional(),
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
