import type { PromptTag } from "./prompt-tags";

export type LessonType =
  | "choice"
  | "fill-in-prompt"
  | "comparison"
  | "free-write";

export type Difficulty = "easy" | "normal" | "hard";

export interface PracticalTemplate {
  title: string;
  tag: PromptTag;
  template: string;
  example?: string;
}

export interface SavedPrompt {
  id: string;
  title: string;
  tag: PromptTag;
  template: string;
  example?: string;
  fromLessonId?: string;
  savedAt: string;
}

export interface ChoiceQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface FillInBlank {
  key: string;
  label: string;
  options: string[];
  correct: string[];
}

export interface ComparisonItem {
  label: string;
  prompt: string;
  response: string;
}

export interface FreeWriteCheck {
  id: string;
  label: string;
  pattern: string;
  flags?: string;
}

export interface SampleResponses {
  bad?: string;
  ok?: string;
  good?: string;
}

export interface FeedbackPair {
  good?: string;
  bad?: string;
}

export interface BaseLesson {
  id: string;
  unit: string;
  order: number;
  title: string;
  subtitle?: string;
  lesson: string;
  difficulty?: Difficulty;
  estimatedMinutes?: number;
  keyPoints?: string[];
  practicalScenario?: string;
  practicalTemplate?: PracticalTemplate;
  rewards: { xp: number };
}

export interface ChoiceLesson extends BaseLesson {
  type: "choice";
  questions: ChoiceQuestion[];
}

export interface FillInPromptLesson extends BaseLesson {
  type: "fill-in-prompt";
  scenario?: string;
  template: string;
  blanks: FillInBlank[];
  sampleResponses?: SampleResponses;
  feedback?: FeedbackPair;
}

export interface ComparisonLesson extends BaseLesson {
  type: "comparison";
  question: string;
  items: ComparisonItem[];
  betterIndex: number;
  explanation: string;
}

export interface FreeWriteLesson extends BaseLesson {
  type: "free-write";
  goal: string;
  hints: string[];
  checks: FreeWriteCheck[];
  passThreshold: number;
  sampleResponses?: SampleResponses;
  feedback?: FeedbackPair;
}

export type Lesson =
  | ChoiceLesson
  | FillInPromptLesson
  | ComparisonLesson
  | FreeWriteLesson;

export interface Unit {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  lessons: string[];
}
