"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Check, ChevronRight, Flame, RotateCcw, Star, Zap } from "lucide-react";
import { useState } from "react";
import type { Lesson } from "@/lib/types";
import { useProgress } from "@/lib/store";
import { getRank, getNextRank, rankProgress, DAILY_GOAL_XP } from "@/lib/ranks";
import { Pio } from "@/components/pio/Pio";
import { BottomNav } from "@/components/nav/BottomNav";
import { cn } from "@/lib/utils";

interface ProfileViewProps {
  lessons: Lesson[];
}

export function ProfileView({ lessons }: ProfileViewProps) {
  const totalXp = useProgress((s) => s.totalXp);
  const todayXp = useProgress((s) => s.todayXp);
  const streakDays = useProgress((s) => s.streakDays);
  const lessonState = useProgress((s) => s.lessons);
  const savedPromptCount = useProgress((s) => s.savedPrompts.length);
  const hasHydrated = useProgress((s) => s.hasHydrated);
  const resetAll = useProgress((s) => s.resetAll);
  const [confirming, setConfirming] = useState(false);

  const xp = hasHydrated ? totalXp : 0;
  const streak = hasHydrated ? streakDays : 0;
  const completedCount = hasHydrated
    ? lessons.filter((l) => lessonState[l.id]).length
    : 0;
  const allDone = completedCount === lessons.length && lessons.length > 0;

  const rank = getRank(xp);
  const nextRank = getNextRank(xp);
  const progress = rankProgress(xp);
  const todayPct = Math.min((hasHydrated ? todayXp : 0) / DAILY_GOAL_XP, 1);
  const todayDone = hasHydrated && todayXp >= DAILY_GOAL_XP;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-stone-200 bg-white/80 px-4 py-3 backdrop-blur">
        <Link
          href="/"
          className="rounded-full p-2 text-stone-500 hover:bg-stone-200 hover:text-stone-900"
          aria-label="ホームに戻る"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="text-base font-bold text-stone-900">プロフィール</div>
      </header>

      <main className="flex-1 px-4 py-6">
        <section className="mb-8 flex flex-col items-center gap-3 text-center">
          <Pio mood={allDone ? "happy" : "normal"} size={120} animated={false} />
          <div
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-1.5 text-base font-bold ring-2",
              rank.bgClass,
              rank.colorClass,
              rank.ringClass,
            )}
          >
            <span>{rank.badge}</span>
            <span>{rank.title}</span>
          </div>
          {nextRank ? (
            <div className="w-full max-w-xs">
              <div className="mb-1 flex justify-between text-[11px] text-stone-500">
                <span>{xp} XP</span>
                <span>次のランク: {nextRank.badge} {nextRank.title} ({nextRank.minXp} XP)</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
                <div
                  className={cn("h-full rounded-full transition-all duration-700", rank.colorClass.replace("text-", "bg-"))}
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="text-sm font-semibold text-emerald-600">
              最高ランク達成！おめでとう！
            </div>
          )}
        </section>

        <section className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm font-bold text-stone-700">
              <Zap className={cn("h-4 w-4", todayDone ? "fill-amber-500 text-amber-500" : "fill-stone-400 text-stone-400")} />
              今日のゴール
            </div>
            <div className={cn("text-sm font-bold", todayDone ? "text-amber-700" : "text-stone-500")}>
              {hasHydrated ? todayXp : 0} / {DAILY_GOAL_XP} XP
            </div>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-amber-100">
            <div
              className={cn("h-full rounded-full transition-all duration-700", todayDone ? "bg-amber-400" : "bg-emerald-400")}
              style={{ width: `${todayPct * 100}%` }}
            />
          </div>
          {todayDone && (
            <div className="mt-2 text-center text-xs font-semibold text-amber-700">
              今日のゴール達成！
            </div>
          )}
        </section>

        <section className="mb-8 grid grid-cols-3 gap-3">
          <StatCard
            icon={<Zap className="h-5 w-5 fill-amber-500 text-amber-500" />}
            label="XP"
            value={xp}
            color="amber"
          />
          <StatCard
            icon={<Flame className="h-5 w-5 fill-orange-500 text-orange-500" />}
            label="連続日数"
            value={streak}
            color="orange"
          />
          <StatCard
            icon={<Star className="h-5 w-5 fill-emerald-500 text-emerald-500" />}
            label="完走"
            value={`${completedCount}/${lessons.length}`}
            color="emerald"
          />
        </section>

        <section className="mb-8">
          <Link
            href="/library"
            className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm transition-colors hover:bg-emerald-50/50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-stone-900">
                マイプロンプト集
              </div>
              <div className="mt-0.5 text-xs text-stone-500">
                {hasHydrated && savedPromptCount > 0
                  ? `${savedPromptCount}件のテンプレを保存中`
                  : "レッスンで気に入ったテンプレを保存しよう"}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-stone-400" />
          </Link>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-stone-500">
            レッスン履歴
          </h2>
          <ul className="flex flex-col gap-2">
            {lessons.map((l) => {
              const state = lessonState[l.id];
              const completed = hasHydrated && Boolean(state);
              return (
                <li
                  key={l.id}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border bg-white p-3",
                    completed ? "border-emerald-200" : "border-stone-200",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      completed
                        ? "bg-emerald-500 text-white"
                        : "bg-stone-200 text-stone-500",
                    )}
                  >
                    {completed ? <Check className="h-4 w-4" /> : l.order}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm font-semibold text-stone-900">
                      {l.title}
                    </div>
                    {completed && state && (
                      <div className="mt-0.5 text-xs text-stone-500">
                        スコア {state.bestScore ?? 0}% · {state.completedAt}
                      </div>
                    )}
                  </div>
                  {completed && (
                    <Link
                      href={`/lesson/${l.id}`}
                      className="rounded-md bg-stone-100 px-2 py-1 text-xs font-semibold text-stone-600 hover:bg-stone-200"
                    >
                      復習
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-stone-500">
            データ管理
          </h2>
          {!confirming ? (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white py-3 text-sm font-semibold text-stone-600 hover:bg-stone-100"
            >
              <RotateCcw className="h-4 w-4" />
              進捗をリセット
            </button>
          ) : (
            <div className="flex flex-col gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4">
              <div className="text-sm text-rose-900">
                すべてのXP・ストリーク・レッスン進捗が消えます。本当にリセットしますか？
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="rounded-lg bg-white py-2 text-sm font-semibold text-stone-700 ring-1 ring-stone-300 hover:bg-stone-100"
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetAll();
                    setConfirming(false);
                  }}
                  className="rounded-lg bg-rose-500 py-2 text-sm font-bold text-white hover:bg-rose-600"
                >
                  リセットする
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "amber" | "orange" | "emerald";
}) {
  const palette: Record<string, string> = {
    amber: "bg-amber-50 ring-amber-200 text-amber-900",
    orange: "bg-orange-50 ring-orange-200 text-orange-900",
    emerald: "bg-emerald-50 ring-emerald-200 text-emerald-900",
  };
  return (
    <div className={cn("rounded-2xl p-3 text-center ring-1", palette[color])}>
      <div className="flex justify-center">{icon}</div>
      <div className="mt-1 text-xl font-black">{value}</div>
      <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider opacity-70">
        {label}
      </div>
    </div>
  );
}
