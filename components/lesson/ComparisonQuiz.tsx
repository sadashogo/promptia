"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import type { ComparisonLesson } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PioBubble } from "@/components/pio/PioBubble";

interface ComparisonQuizProps {
  lesson: ComparisonLesson;
  onComplete: (correct: number, total: number) => void;
}

export function ComparisonQuiz({ lesson, onComplete }: ComparisonQuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = submitted && selected === lesson.betterIndex;

  const handleSubmit = () => {
    if (selected === null || submitted) return;
    setSubmitted(true);
  };

  const handleFinish = () => onComplete(isCorrect ? 1 : 0, 1);

  return (
    <div className="flex flex-col gap-6">
      <div className="text-xs font-medium uppercase tracking-wider text-stone-500">
        どちらが上手なプロンプト？
      </div>

      <h2 className="text-lg font-bold leading-snug text-stone-900 sm:text-xl">
        {lesson.question}
      </h2>

      <div className="grid gap-3">
        {lesson.items.map((item, idx) => {
          const isSel = selected === idx;
          const isBetter = idx === lesson.betterIndex;
          const showCorrect = submitted && isBetter;
          const showWrong = submitted && isSel && !isBetter;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => !submitted && setSelected(idx)}
              disabled={submitted}
              className={cn(
                "relative flex flex-col gap-3 rounded-2xl border-2 p-4 text-left transition-all disabled:cursor-not-allowed",
                !submitted && "hover:border-emerald-400 hover:bg-emerald-50/50",
                isSel && !submitted && "border-emerald-500 bg-emerald-50",
                !isSel && !submitted && "border-stone-200 bg-white",
                showCorrect && "border-emerald-500 bg-emerald-50",
                showWrong && "border-rose-400 bg-rose-50",
                submitted && !isSel && !isBetter && "border-stone-200 bg-stone-50 opacity-70",
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "rounded-full px-3 py-0.5 text-xs font-bold",
                    showCorrect
                      ? "bg-emerald-500 text-white"
                      : showWrong
                        ? "bg-rose-500 text-white"
                        : "bg-stone-200 text-stone-700",
                  )}
                >
                  {item.label}
                </span>
                {showCorrect && <Check className="h-5 w-5 text-emerald-600" />}
                {showWrong && <X className="h-5 w-5 text-rose-600" />}
              </div>

              <div>
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                  プロンプト
                </div>
                <div className="rounded-lg bg-stone-100 px-3 py-2 text-sm text-stone-800">
                  {item.prompt}
                </div>
              </div>
              <AnimatePresence initial={false}>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                      AIの答え
                    </div>
                    <div className="whitespace-pre-wrap rounded-lg bg-white px-3 py-2 text-sm text-stone-700 ring-1 ring-stone-200">
                      {item.response}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PioBubble mood={isCorrect ? "happy" : "thinking"}>
              <div className="space-y-2">
                <div
                  className={cn(
                    "font-semibold",
                    isCorrect ? "text-emerald-600" : "text-rose-600",
                  )}
                >
                  {isCorrect ? "正解！" : "おしい！"}
                </div>
                <div>{lesson.explanation}</div>
              </div>
            </PioBubble>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-2">
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selected === null}
            className={cn(
              "w-full rounded-xl py-3 text-base font-bold text-white shadow-sm transition-all",
              selected === null
                ? "cursor-not-allowed bg-stone-300"
                : "bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98]",
            )}
          >
            これを選ぶ
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
