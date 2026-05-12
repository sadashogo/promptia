"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Lesson } from "@/lib/types";
import { useProgress } from "@/lib/store";
import { ChoiceQuestion } from "./ChoiceQuestion";
import { FillInPrompt } from "./FillInPrompt";
import { ComparisonQuiz } from "./ComparisonQuiz";
import { FreeWritePrompt } from "./FreeWritePrompt";
import { PioBubble } from "@/components/pio/PioBubble";

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

function Intro({ lesson, onStart }: { lesson: Lesson; onStart: () => void }) {
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
      </div>

      <PioBubble mood="normal">
        <div className="font-semibold text-stone-900">今回のポイント</div>
        <div className="mt-1">{lesson.lesson}</div>
      </PioBubble>

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
