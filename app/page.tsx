import { LessonPath } from "@/components/home/LessonPath";
import { StatsBar } from "@/components/home/StreakBadge";
import { DailyGoalBanner } from "@/components/home/DailyGoalBanner";
import { BottomNav } from "@/components/nav/BottomNav";
import { getAllUnits, getLessonsForUnit } from "@/lib/content";

export default function HomePage() {
  const units = getAllUnits();
  const unit = units[0];
  const lessons = getLessonsForUnit(unit.id);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col bg-stone-50">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-stone-200 bg-white/80 px-4 py-3 backdrop-blur">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-emerald-600">Promptia</span>
          <span className="text-xs font-medium text-stone-500">β</span>
        </div>
        <StatsBar />
      </header>

      <main className="flex-1">
        <DailyGoalBanner />
        <LessonPath unit={unit} lessons={lessons} />
      </main>

      <BottomNav />
    </div>
  );
}
