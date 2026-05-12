"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import type { ChoiceQuestion as Q } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PioBubble } from "@/components/pio/PioBubble";

interface ChoiceQuestionProps {
  question: Q;
  questionNumber: number;
  totalQuestions: number;
  onAnswered: (correct: boolean) => void;
  onNext: () => void;
  isLast: boolean;
}

export function ChoiceQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswered,
  onNext,
  isLast,
}: ChoiceQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null || submitted) return;
    setSubmitted(true);
    onAnswered(selected === question.correctIndex);
  };

  const handleNext = () => {
    setSelected(null);
    setSubmitted(false);
    onNext();
  };

  const isCorrect = submitted && selected === question.correctIndex;

  return (
    <div className="flex flex-col gap-6">
      <div className="text-xs font-medium uppercase tracking-wider text-stone-500">
        問題 {questionNumber} / {totalQuestions}
      </div>

      <h2 className="text-xl font-bold leading-snug text-stone-900 sm:text-2xl">
        {question.prompt}
      </h2>

      <div className="flex flex-col gap-3">
        {question.options.map((opt, idx) => {
          const isSelected = selected === idx;
          const isCorrectOption = idx === question.correctIndex;
          const showCorrect = submitted && isCorrectOption;
          const showWrong = submitted && isSelected && !isCorrectOption;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(idx)}
              disabled={submitted}
              className={cn(
                "group flex items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left text-base font-medium transition-all",
                "disabled:cursor-not-allowed",
                !submitted && "hover:border-emerald-400 hover:bg-emerald-50",
                isSelected && !submitted && "border-emerald-500 bg-emerald-50",
                !isSelected && !submitted && "border-stone-200 bg-white",
                showCorrect && "border-emerald-500 bg-emerald-50 text-emerald-900",
                showWrong && "border-rose-400 bg-rose-50 text-rose-900",
                submitted && !isSelected && !isCorrectOption && "border-stone-200 bg-stone-50 text-stone-500",
              )}
            >
              <span className="flex-1">{opt}</span>
              {showCorrect && <Check className="h-5 w-5 shrink-0 text-emerald-600" />}
              {showWrong && <X className="h-5 w-5 shrink-0 text-rose-600" />}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {submitted && (
          <motion.div
            key="explanation"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <PioBubble mood={isCorrect ? "happy" : "thinking"}>
              <div className="space-y-2">
                <div className={cn("font-semibold", isCorrect ? "text-emerald-600" : "text-rose-600")}>
                  {isCorrect ? "正解！" : "おしい！"}
                </div>
                <div>{question.explanation}</div>
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
            答え合わせ
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="w-full rounded-xl bg-stone-900 py-3 text-base font-bold text-white shadow-sm transition-all hover:bg-stone-800 active:scale-[0.98]"
          >
            {isLast ? "結果を見る" : "次の問題へ"}
          </button>
        )}
      </div>
    </div>
  );
}
