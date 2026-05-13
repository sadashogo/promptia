"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import type { PracticalTemplate } from "@/lib/types";
import { Pio } from "@/components/pio/Pio";
import { PioBubble } from "@/components/pio/PioBubble";
import { PracticalTemplateCard } from "./PracticalTemplateCard";

interface ResultViewProps {
  lessonId: string;
  lessonTitle: string;
  correct: number;
  total: number;
  xp: number;
  nextLessonId?: string;
  practicalTemplate?: PracticalTemplate;
}

export function ResultView({
  lessonId,
  lessonTitle,
  correct,
  total,
  xp,
  nextLessonId,
  practicalTemplate,
}: ResultViewProps) {
  const allCorrect = total > 0 && correct === total;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-between px-4 py-10">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="relative"
          aria-hidden
        >
          <Pio mood={allCorrect ? "happy" : "normal"} size={140} />
          {allCorrect && (
            <div className="absolute -top-2 -right-2 text-4xl">🎉</div>
          )}
        </motion.div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            レッスンクリア！
          </div>
          <h1 className="mt-1 text-2xl font-bold text-stone-900 sm:text-3xl">
            {lessonTitle}
          </h1>
        </div>

        <div className="grid w-full grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200"
          >
            <div className="flex items-center justify-center gap-1.5 text-amber-700">
              <Zap className="h-5 w-5 fill-amber-500 text-amber-500" />
              <span className="text-2xl font-black">+{xp}</span>
            </div>
            <div className="mt-1 text-xs font-semibold text-amber-700">XP</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200"
          >
            <div className="text-2xl font-black text-emerald-700">{accuracy}%</div>
            <div className="mt-1 text-xs font-semibold text-emerald-700">
              正答率 ({correct}/{total})
            </div>
          </motion.div>
        </div>

        <PioBubble mood={allCorrect ? "happy" : "normal"}>
          {allCorrect
            ? "全問正解、すばらしい！この調子でどんどん進もう！"
            : "クリアおめでとう！間違えたところはまた挑戦してみよう。"}
        </PioBubble>

        {practicalTemplate && (
          <PracticalTemplateCard
            template={practicalTemplate}
            fromLessonId={lessonId}
          />
        )}
      </div>

      <div className="mt-6 flex w-full flex-col gap-2">
        {nextLessonId ? (
          <Link
            href={`/lesson/${nextLessonId}`}
            className="w-full rounded-xl bg-emerald-500 py-3 text-center text-base font-bold text-white shadow-sm transition-all hover:bg-emerald-600 active:scale-[0.98]"
          >
            次のレッスンへ
          </Link>
        ) : (
          <Link
            href="/"
            className="w-full rounded-xl bg-emerald-500 py-3 text-center text-base font-bold text-white shadow-sm transition-all hover:bg-emerald-600 active:scale-[0.98]"
          >
            ユニット完走！ホームに戻る
          </Link>
        )}
        <Link
          href="/"
          className="w-full rounded-xl bg-white py-3 text-center text-base font-bold text-stone-700 ring-1 ring-stone-200 transition-all hover:bg-stone-100 active:scale-[0.98]"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}
