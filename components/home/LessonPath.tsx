"use client";

import Link from "next/link";
import { Check, Lock, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { Lesson, Unit } from "@/lib/types";
import { useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";

interface LessonPathProps {
  unit: Unit;
  lessons: Lesson[];
}

export function LessonPath({ unit, lessons }: LessonPathProps) {
  const lessonState = useProgress((s) => s.lessons);
  const hasHydrated = useProgress((s) => s.hasHydrated);

  let firstUnlockedFound = false;
  const annotated = lessons.map((l) => {
    const completed = hasHydrated && Boolean(lessonState[l.id]);
    let unlocked = true;
    if (l.order > 1) {
      const prev = lessons[l.order - 2];
      unlocked = prev ? Boolean(lessonState[prev.id]) : false;
    }
    const isCurrent = unlocked && !completed && !firstUnlockedFound;
    if (isCurrent) firstUnlockedFound = true;
    return { lesson: l, completed, unlocked, isCurrent };
  });

  return (
    <section className="flex flex-col gap-2 px-4 pb-8">
      <header className="mb-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Unit 1
        </div>
        <h1 className="mt-1 text-2xl font-bold text-stone-900">{unit.title}</h1>
        <p className="mt-1 text-sm text-stone-600">{unit.subtitle}</p>
      </header>

      <ol className="relative flex flex-col items-center gap-6 py-4">
        <div
          className="absolute inset-y-4 left-1/2 w-1 -translate-x-1/2 rounded-full bg-stone-200"
          aria-hidden
        />
        {annotated.map(({ lesson, completed, unlocked, isCurrent }, idx) => {
          const offsetClass =
            idx % 4 === 0
              ? "translate-x-0"
              : idx % 4 === 1
                ? "translate-x-16"
                : idx % 4 === 2
                  ? "translate-x-0"
                  : "-translate-x-16";

          return (
            <li
              key={lesson.id}
              className={cn("relative z-10 flex w-full justify-center", offsetClass)}
            >
              <LessonNode
                lesson={lesson}
                completed={completed}
                unlocked={unlocked}
                isCurrent={isCurrent}
              />
            </li>
          );
        })}
      </ol>
    </section>
  );
}

interface LessonNodeProps {
  lesson: Lesson;
  completed: boolean;
  unlocked: boolean;
  isCurrent: boolean;
}

function LessonNode({ lesson, completed, unlocked, isCurrent }: LessonNodeProps) {
  const inner = (
    <motion.div
      whileHover={unlocked ? { scale: 1.05 } : undefined}
      whileTap={unlocked ? { scale: 0.95 } : undefined}
      className={cn(
        "flex flex-col items-center gap-2 transition-opacity",
        !unlocked && "opacity-60",
      )}
    >
      <div
        className={cn(
          "relative flex h-20 w-20 items-center justify-center rounded-full text-3xl font-black shadow-md",
          completed && "bg-amber-400 text-white ring-4 ring-amber-200",
          isCurrent && !completed && "bg-emerald-500 text-white ring-4 ring-emerald-200",
          !completed && !isCurrent && unlocked && "bg-stone-100 text-stone-400 ring-4 ring-stone-200",
          !unlocked && "bg-stone-200 text-stone-400 ring-4 ring-stone-100",
        )}
      >
        {completed ? (
          <Star className="h-8 w-8 fill-white" />
        ) : !unlocked ? (
          <Lock className="h-7 w-7" />
        ) : isCurrent ? (
          lesson.order
        ) : (
          lesson.order
        )}
        {isCurrent && (
          <motion.div
            className="absolute -inset-2 rounded-full border-2 border-emerald-400"
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>
      <div className="max-w-[10rem] text-center text-xs font-semibold leading-tight text-stone-700">
        {lesson.title}
      </div>
      <div className="flex items-center gap-1.5 text-[10px] font-semibold">
        {lesson.difficulty && (
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5",
              lesson.difficulty === "easy" && "bg-emerald-100 text-emerald-700",
              lesson.difficulty === "normal" && "bg-amber-100 text-amber-700",
              lesson.difficulty === "hard" && "bg-rose-100 text-rose-700",
            )}
          >
            {lesson.difficulty === "easy"
              ? "初級"
              : lesson.difficulty === "normal"
                ? "中級"
                : "上級"}
          </span>
        )}
        {lesson.estimatedMinutes && (
          <span className="text-stone-500">·{lesson.estimatedMinutes}分</span>
        )}
      </div>
      {completed && (
        <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-600">
          <Check className="h-3 w-3" /> CLEAR
        </div>
      )}
    </motion.div>
  );

  if (!unlocked) {
    return <div className="cursor-not-allowed">{inner}</div>;
  }

  return (
    <Link href={`/lesson/${lesson.id}`} className="block">
      {inner}
    </Link>
  );
}
