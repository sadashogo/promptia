"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Briefcase, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Lesson } from "@/lib/types";
import { useProgress } from "@/lib/store";
import { ChoiceQuestion } from "./ChoiceQuestion";
import { FillInPrompt } from "./FillInPrompt";
import { ComparisonQuiz } from "./ComparisonQuiz";
import { FreeWritePrompt } from "./FreeWritePrompt";
import { PioBubble } from "@/components/pio/PioBubble";
import { cn } from "@/lib/utils";

interface LessonRunnerProps {
  lesson: Lesson;
}

export function LessonRunner({ lesson }: LessonRunnerProps) {
  const router = useRouter();
  const completeLesson = useProgress((s) => s.completeLesson);
  const [started, setStarted] = useState(false);

  const finalize = (correct: number, total: number) => {
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    completeLesson(lesson.id, lesson.rewards.xp, score);
    router.push(
      `/result/${lesson.id}?correct=${correct}&total=${total}&xp=${lesson.rewards.xp}`,
    );
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col">
      <header className="flex items-center gap-3 px-4 py-3">
        <Link
          href="/"
          className="rounded-full p-2 text-stone-500 hover:bg-stone-200 hover:text-stone-900"
          aria-label="ホームに戻る"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <ProgressBar started={started} lesson={lesson} />
      </header>

      <main className="flex-1 px-4 py-6">
        {!started ? (
          <Intro lesson={lesson} onStart={() => setStarted(true)} />
        ) : (
          <LessonBody lesson={lesson} onComplete={finalize} />
        )}
      </main>
    </div>
  );
}

function ProgressBar({ started, lesson }: { started: boolean; lesson: Lesson }) {
  const pct = !started ? 0 : 100;
  return (
    <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200">
      <motion.div
        className="h-full bg-emerald-500"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
    </div>
  );
}

const DIFFICULTY_LABEL: Record<string, { label: string; cls: string }> = {
  easy: { label: "初級", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  normal: { label: "中級", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  hard: { label: "上級", cls: "bg-rose-50 text-rose-700 ring-rose-200" },
};

function Intro({ lesson, onStart }: { lesson: Lesson; onStart: () => void }) {
  const diff = lesson.difficulty ? DIFFICULTY_LABEL[lesson.difficulty] : null;
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Lesson {lesson.order}
        </div>
        <h1 className="mt-1 text-2xl font-bold leading-snug text-stone-900 sm:text-3xl">
          {lesson.title}
        </h1>
        {lesson.subtitle && (
          <p className="mt-2 text-stone-600">{lesson.subtitle}</p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {diff && (
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-bold ring-1",
                diff.cls,
              )}
            >
              {diff.label}
            </span>
          )}
          {lesson.estimatedMinutes && (
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-bold text-stone-600 ring-1 ring-stone-200">
              <Clock className="h-3 w-3" />
              約{lesson.estimatedMinutes}分
            </span>
          )}
        </div>
      </div>

      <PioBubble mood="normal">
        <div className="font-semibold text-stone-900">今回のポイント</div>
        <div className="mt-1">{lesson.lesson}</div>
      </PioBubble>

      {lesson.keyPoints && lesson.keyPoints.length > 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
          <div className="mb-2 flex items-center gap-1.5 text-sm font-bold text-emerald-800">
            <Sparkles className="h-4 w-4 fill-emerald-500 text-emerald-500" />
            このレッスンで学ぶこと
          </div>
          <ul className="space-y-1.5">
            {lesson.keyPoints.map((p, i) => (
              <li key={i} className="flex gap-2 text-sm text-stone-800">
                <span className="font-bold text-emerald-600">{i + 1}.</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {lesson.practicalScenario && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
          <div className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-amber-800">
            <Briefcase className="h-4 w-4" />
            実務シナリオ
          </div>
          <div className="text-sm text-stone-800">{lesson.practicalScenario}</div>
        </div>
      )}

      <button
        type="button"
        onClick={onStart}
        className="mt-2 w-full rounded-xl bg-emerald-500 py-3 text-base font-bold text-white shadow-sm transition-all hover:bg-emerald-600 active:scale-[0.98]"
      >
        はじめる
      </button>
    </div>
  );
}

function LessonBody({
  lesson,
  onComplete,
}: {
  lesson: Lesson;
  onComplete: (correct: number, total: number) => void;
}) {
  if (lesson.type === "choice") {
    return <ChoiceLessonBody lesson={lesson} onComplete={onComplete} />;
  }
  if (lesson.type === "fill-in-prompt") {
    return <FillInPrompt lesson={lesson} onComplete={onComplete} />;
  }
  if (lesson.type === "comparison") {
    return <ComparisonQuiz lesson={lesson} onComplete={onComplete} />;
  }
  if (lesson.type === "free-write") {
    return <FreeWritePrompt lesson={lesson} onComplete={onComplete} />;
  }
  return null;
}

function ChoiceLessonBody({
  lesson,
  onComplete,
}: {
  lesson: Extract<Lesson, { type: "choice" }>;
  onComplete: (correct: number, total: number) => void;
}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const total = lesson.questions.length;

  const handleAnswered = (correct: boolean) => {
    if (correct) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    if (questionIndex + 1 >= total) {
      onComplete(correctCount, total);
    } else {
      setQuestionIndex((i) => i + 1);
    }
  };

  return (
    <ChoiceQuestion
      key={questionIndex}
      question={lesson.questions[questionIndex]}
      questionNumber={questionIndex + 1}
      totalQuestions={total}
      onAnswered={handleAnswered}
      onNext={handleNext}
      isLast={questionIndex + 1 >= total}
    />
  );
}
