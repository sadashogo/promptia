"use client";

import { Zap } from "lucide-react";
import { useProgress } from "@/lib/store";
import { DAILY_GOAL_XP } from "@/lib/ranks";
import { cn } from "@/lib/utils";

export function DailyGoalBanner() {
  const todayXp = useProgress((s) => s.todayXp);
  const hasHydrated = useProgress((s) => s.hasHydrated);

  const today = hasHydrated ? todayXp : 0;
  const pct = Math.min(today / DAILY_GOAL_XP, 1);
  const done = today >= DAILY_GOAL_XP;

  return (
    <div
      className={cn(
        "mx-4 mt-4 rounded-2xl border px-4 py-3 transition-colors",
        done
          ? "border-amber-300 bg-amber-50"
          : "border-stone-200 bg-white",
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-bold text-stone-700">
          <Zap className={cn("h-4 w-4", done ? "fill-amber-500 text-amber-500" : "fill-stone-400 text-stone-400")} />
          今日のゴール
        </div>
        <div className={cn("text-sm font-bold", done ? "text-amber-700" : "text-stone-500")}>
          {today} / {DAILY_GOAL_XP} XP
        </div>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-stone-100">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            done ? "bg-amber-400" : "bg-emerald-400",
          )}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
      {done && (
        <div className="mt-2 text-center text-xs font-semibold text-amber-700">
          今日のゴール達成！すごい！
        </div>
      )}
    </div>
  );
}
