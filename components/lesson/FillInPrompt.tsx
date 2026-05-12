"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { FillInPromptLesson } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PioBubble } from "@/components/pio/PioBubble";

interface FillInPromptProps {
  lesson: FillInPromptLesson;
  onComplete: (correct: number, total: number) => void;
}

export function FillInPrompt({ lesson, onComplete }: FillInPromptProps) {
  const [selections, setSelections] = useState<Record<string, string | null>>(
    Object.fromEntries(lesson.blanks.map((b) => [b.key, null])),
  );
  const [openBlank, setOpenBlank] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const allFilled = lesson.blanks.every((b) => selections[b.key] !== null);

  const correctCount = lesson.blanks.filter((b) => {
    const sel = selections[b.key];
    return sel !== null && b.correct.includes(sel);
  }).length;
  const allCorrect = correctCount === lesson.blanks.length;

  const handleSubmit = () => {
    if (!allFilled || submitted) return;
    setSubmitted(true);
    setOpenBlank(null);
  };

  const handleFinish = () => {
    onComplete(correctCount, lesson.blanks.length);
  };

  const renderTemplate = () => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const regex = /\{\{(\w+)\}\}/g;
    let match;
    let i = 0;
    while ((match = regex.exec(lesson.template)) !== null) {
      const before = lesson.template.slice(lastIndex, match.index);
      if (before) parts.push(<span key={`t-${i}`}>{before}</span>);
      const key = match[1];
      const blank = lesson.blanks.find((b) => b.key === key);
      const value = selections[key];
      const isCorrect = blank && value !== null && blank.correct.includes(value);
      parts.push(
        <button
          key={`b-${key}`}
          type="button"
          onClick={() => !submitted && setOpenBlank(openBlank === key ? null : key)}
          disabled={submitted}
          className={cn(
            "mx-0.5 inline-flex items-center gap-1 rounded-md border-2 border-dashed px-2 py-0.5 align-baseline text-sm font-bold transition-all",
            value === null
              ? "border-stone-300 bg-stone-100 text-stone-400 hover:border-emerald-400 hover:bg-emerald-50"
              : !submitted
                ? "border-emerald-400 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                : isCorrect
                  ? "border-emerald-500 bg-emerald-100 text-emerald-900"
                  : "border-rose-400 bg-rose-50 text-rose-900",
            "disabled:cursor-not-allowed",
          )}
        >
          <span>{value ?? `[${blank?.label ?? key}]`}</span>
          {!submitted && <ChevronDown className="h-3 w-3" />}
        </button>,
      );
      lastIndex = match.index + match[0].length;
      i++;
    }
    if (lastIndex < lesson.template.length) {
      parts.push(<span key={`t-end`}>{lesson.template.slice(lastIndex)}</span>);
    }
    return parts;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-xs font-medium uppercase tracking-wider text-stone-500">
        プロンプトを完成させよう
      </div>

      {lesson.scenario && (
        <PioBubble mood="normal">{lesson.scenario}</PioBubble>
      )}

      <div className="rounded-2xl bg-stone-100 p-4 text-base leading-loose text-stone-800">
        {renderTemplate()}
      </div>

      <AnimatePresence>
        {openBlank && !submitted && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl border border-stone-200 bg-white p-3 shadow-sm"
          >
            <div className="mb-2 text-xs font-semibold text-stone-500">
              {lesson.blanks.find((b) => b.key === openBlank)?.label}
            </div>
            <div className="flex flex-col gap-2">
              {lesson.blanks
                .find((b) => b.key === openBlank)
                ?.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      const currentBlankKey = openBlank;
                      setSelections((prev) => {
                        const updated = { ...prev, [currentBlankKey]: opt };
                        const next = lesson.blanks.find(
                          (b) => updated[b.key] === null && b.key !== currentBlankKey,
                        );
                        setOpenBlank(next?.key ?? null);
                        return updated;
                      });
                    }}
                    className={cn(
                      "rounded-lg border-2 px-3 py-2 text-left text-sm font-medium transition-all",
                      selections[openBlank] === opt
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                        : "border-stone-200 bg-white hover:border-emerald-400 hover:bg-emerald-50",
                    )}
                  >
                    {opt}
                  </button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            <PioBubble mood={allCorrect ? "happy" : "thinking"}>
              <div className="space-y-2">
                <div
                  className={cn(
                    "font-semibold",
                    allCorrect ? "text-emerald-600" : "text-amber-600",
                  )}
                >
                  {allCorrect
                    ? "完璧！理想のプロンプトです"
                    : `${correctCount}/${lesson.blanks.length} 正解。もう少し！`}
                </div>
                <div>
                  {allCorrect
                    ? lesson.feedback?.good ?? "このプロンプトなら、AIは狙い通りの答えを返してくれます。"
                    : lesson.feedback?.bad ?? "選び方を変えると、もっと精度の高い答えが返ってきますよ。"}
                </div>
              </div>
            </PioBubble>

            {lesson.sampleResponses && (
              <div className="space-y-3">
                {lesson.sampleResponses.good && (
                  <SampleCard tone="good" text={lesson.sampleResponses.good} />
                )}
                {lesson.sampleResponses.bad && (
                  <SampleCard tone="bad" text={lesson.sampleResponses.bad} />
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-2">
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allFilled}
            className={cn(
              "w-full rounded-xl py-3 text-base font-bold text-white shadow-sm transition-all",
              !allFilled
                ? "cursor-not-allowed bg-stone-300"
                : "bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98]",
            )}
          >
            送信する
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            className="w-full rounded-xl bg-stone-900 py-3 text-base font-bold text-white shadow-sm transition-all hover:bg-stone-800 active:scale-[0.98]"
          >
            結果を見る
          </button>
        )}
      </div>
    </div>
  );
}

function SampleCard({ tone, text }: { tone: "good" | "bad"; text: string }) {
  const isGood = tone === "good";
  return (
    <div
      className={cn(
        "rounded-xl border-2 p-3",
        isGood
          ? "border-emerald-200 bg-emerald-50"
          : "border-stone-200 bg-stone-50",
      )}
    >
      <div
        className={cn(
          "mb-1.5 flex items-center gap-1 text-xs font-bold",
          isGood ? "text-emerald-700" : "text-stone-500",
        )}
      >
        {isGood ? "▲ 良いプロンプトの答え" : "▽ 雑なプロンプトの答え"}
      </div>
      <div className="whitespace-pre-wrap text-sm text-stone-800">{text}</div>
    </div>
  );
}
