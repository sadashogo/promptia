export type PromptTag =
  | "writing"
  | "planning"
  | "explanation"
  | "ideation"
  | "comparison"
  | "email"
  | "meeting"
  | "summary"
  | "research"
  | "other";

export interface TagInfo {
  label: string;
  emoji: string;
  bgClass: string;
  textClass: string;
  ringClass: string;
}

export const TAG_INFO: Record<PromptTag, TagInfo> = {
  writing: {
    label: "文章作成",
    emoji: "✍️",
    bgClass: "bg-rose-50",
    textClass: "text-rose-700",
    ringClass: "ring-rose-200",
  },
  planning: {
    label: "企画",
    emoji: "📋",
    bgClass: "bg-amber-50",
    textClass: "text-amber-700",
    ringClass: "ring-amber-200",
  },
  explanation: {
    label: "説明",
    emoji: "💡",
    bgClass: "bg-sky-50",
    textClass: "text-sky-700",
    ringClass: "ring-sky-200",
  },
  ideation: {
    label: "アイデア出し",
    emoji: "🌱",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-700",
    ringClass: "ring-emerald-200",
  },
  comparison: {
    label: "比較・選定",
    emoji: "⚖️",
    bgClass: "bg-purple-50",
    textClass: "text-purple-700",
    ringClass: "ring-purple-200",
  },
  email: {
    label: "メール",
    emoji: "📧",
    bgClass: "bg-sky-50",
    textClass: "text-sky-700",
    ringClass: "ring-sky-200",
  },
  meeting: {
    label: "会議",
    emoji: "🤝",
    bgClass: "bg-indigo-50",
    textClass: "text-indigo-700",
    ringClass: "ring-indigo-200",
  },
  summary: {
    label: "要約",
    emoji: "📝",
    bgClass: "bg-teal-50",
    textClass: "text-teal-700",
    ringClass: "ring-teal-200",
  },
  research: {
    label: "リサーチ",
    emoji: "🔍",
    bgClass: "bg-fuchsia-50",
    textClass: "text-fuchsia-700",
    ringClass: "ring-fuchsia-200",
  },
  other: {
    label: "その他",
    emoji: "📌",
    bgClass: "bg-stone-100",
    textClass: "text-stone-700",
    ringClass: "ring-stone-200",
  },
};

export const ALL_TAGS: PromptTag[] = [
  "writing",
  "planning",
  "explanation",
  "ideation",
  "comparison",
  "email",
  "meeting",
  "summary",
  "research",
  "other",
];

export function getTagInfo(tag: PromptTag): TagInfo {
  return TAG_INFO[tag] ?? TAG_INFO.other;
}
