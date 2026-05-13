"use client";

import Link from "next/link";
import { BookOpen, Flame, Zap } from "lucide-react";
import { useProgress } from "@/lib/store";

export function StatsBar() {
  const totalXp = useProgress((s) => s.totalXp);
  const streakDays = useProgress((s) => s.streakDays);
  const savedCount = useProgress((s) => s.savedPrompts.length);
  const hasHydrated = useProgress((s) => s.hasHydrated);

  const xp = hasHydrated ? totalXp : 0;
  const streak = hasHydrated ? streakDays : 0;
  const saved = hasHydrated ? savedCount : 0;

  return (
    <div className="flex items-center gap-1.5">
      <Link
        href="/library"
        className="relative flex items-center justify-center rounded-full bg-emerald-50 p-2 text-emerald-700 ring-1 ring-emerald-200 transition-colors hover:bg-emerald-100"
        aria-label="マイプロンプト集"
      >
        <BookOpen className="h-4 w-4" />
        {saved > 0 && (
          <span className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-emerald-500 px-1 text-center text-[10px] font-bold leading-tight text-white">
            {saved}
          </span>
        )}
      </Link>
      <Link
        href="/profile"
        className="flex items-center gap-1.5 rounded-full px-1 py-1 transition-colors hover:bg-stone-100"
        aria-label="プロフィールを開く"
      >
        <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1.5 text-sm font-bold text-amber-700 ring-1 ring-amber-200">
          <Zap className="h-4 w-4 fill-amber-500 text-amber-500" />
          <span>{xp}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1.5 text-sm font-bold text-orange-700 ring-1 ring-orange-200">
          <Flame className="h-4 w-4 fill-orange-500 text-orange-500" />
          <span>{streak}</span>
        </div>
      </Link>
    </div>
  );
}
