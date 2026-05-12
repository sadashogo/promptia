"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Lightbulb, X } from "lucide-react";
import type { FreeWriteLesson } from "@/lib/types";
import { cn } from "@/lib/utils";
import { gradeFreeWrite } from "@/lib/grading";
import { PioBubble } from "@/components/pio/PioBubble";

interface FreeWritePromptProps {
  lesson: FreeWriteLesson;
  onComplete: (correct: number, total: number) => void;
}

export function FreeWritePrompt({ lesson, onComplete }: FreeWritePromptProps) {
  const [text, setText] = useState("");
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const results = useMemo(
    () => (submitted ? gradeFreeWrite(text, lesson.checks) : []),
    [submitted, text, lesson.checks],
  );
  const passedCount = results.filter((r) => r.passed).length;
  const total = lesson.checks.length;
  const passed = submitted && passedCount >= lesson.passThreshold;

  const handleSubmit = () => {
    if (text.trim().length < 10 || submitted) return;
    setSubmitted(true);
  };

  const handleFinish = () => onComplete(passedCount, total);

  const handleRevealHint = () => {
    if (hintsRevealed < lesson.hints.length) {
      setHintsRevealed((n) => n + 1);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-xs font-medium uppercase tracking-wider text-stone-500">
        仕上げチャレンジ
      </div>

      <PioBubble mood="normal">
        <div className="space-y-1">
          <div className="font-semibold text-stone-900">課題</div>
          <div>{lesson.goal}</div>
        </div>
      </PioBubble>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-stone-700">
          あなたのプロンプト
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={submitted}
          placeholder="ここに、AIにお願いする文を書いてください。"
          rows={6}
          className={cn(
            "rounded-xl border-2 border-stone-200 bg-white p-3 text-sm leading-relaxed text-stone-900 transition-all",
            "focus:border-emerald-400 focus:outline-none",
            "disabled:bg-stone-50 disabled:text-stone-700",
          )}
        />
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>{text.length} 文字</span>
          {!submitted && hintsRevealed < lesson.hints.length && (
            <button
              type="button"
              onClick={handleRevealHint}
              className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100"
            >
              <Lightbulb className="h-3 w-3" />
              ヒントをもらう ({hintsRevealed}/{lesson.hints.length})
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {hintsRevealed > 0 && !submitted && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            {lesson.hints.slice(0, hintsRevealed).map((hint, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-amber-200"
              >
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>{hint}</span>
              </div>
            ))}
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
            <div className="rounded-2xl border-2 border-stone-200 bg-white p-4">
              <div className="mb-3 text-sm font-bold text-stone-700">
                チェックリスト ({passedCount}/{total})
              </div>
              <ul className="flex flex-col gap-2">
                {results.map((r) => (
                  <li key={r.id} className="flex items-start gap-2 text-sm">
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                        r.passed
                          ? "bg-emerald-500 text-white"
                          : "bg-stone-200 text-stone-400",
                      )}
                    >
                      {r.passed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    </span>
                    <span className={r.passed ? "text-stone-800" : "text-stone-400"}>
                      {r.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <PioBubble mood={passed ? "happy" : "thinking"}>
              <div className="space-y-2">
                <div
                  className={cn(
                    "font-semibold",
                    passed ? "text-emerald-600" : "text-amber-600",
                  )}
                >
                  {passed ? "クリア！" : "あと少し！"}
                </div>
                <div>
                  {passed
                    ? lesson.feedback?.good ??
                      "ばっちりです！この調子でAIに頼めばどんどん仕事が楽になります。"
                    : lesson.feedback?.bad ??
                      `${lesson.passThreshold}つ以上の項目をクリアできれば合格。もう一度チャレンジしてもOKです。`}
                </div>
              </div>
            </PioBubble>

            {lesson.sampleResponses?.good && (
              <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-3">
                <div className="mb-1.5 text-xs font-bold text-emerald-700">
                  ▲ お手本のプロンプト
                </div>
                <div className="whitespace-pre-wrap text-sm text-stone-800">
                  {lesson.sampleResponses.good}
                </div>
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
            disabled={text.trim().length < 10}
            className={cn(
              "w-full rounded-xl py-3 text-base font-bold text-white shadow-sm transition-all",
              text.trim().length < 10
                ? "cursor-not-allowed bg-stone-300"
                : "bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98]",
            )}
          >
            提出する
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
