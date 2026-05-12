"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { daysBetween, todayKey } from "./utils";

export interface LessonProgress {
  completedAt: string;
  xpEarned: number;
  bestScore?: number;
}

interface ProgressState {
  totalXp: number;
  todayXp: number;
  streakDays: number;
  lastActiveDate: string | null;
  lessons: Record<string, LessonProgress>;
  hasHydrated: boolean;
  setHydrated: (v: boolean) => void;
  completeLesson: (lessonId: string, xp: number, score?: number) => void;
  resetAll: () => void;
}

const STORAGE_KEY = "promptia-progress-v1";

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      totalXp: 0,
      todayXp: 0,
      streakDays: 0,
      lastActiveDate: null,
      lessons: {},
      hasHydrated: false,
      setHydrated: (v) => set({ hasHydrated: v }),
      completeLesson: (lessonId, xp, score) => {
        const today = todayKey();
        const last = get().lastActiveDate;
        let nextStreak = get().streakDays;
        if (!last) {
          nextStreak = 1;
        } else {
          const diff = daysBetween(last, today);
          if (diff === 0) {
            nextStreak = nextStreak === 0 ? 1 : nextStreak;
          } else if (diff === 1) {
            nextStreak = nextStreak + 1;
          } else if (diff > 1) {
            nextStreak = 1;
          }
        }
        const previous = get().lessons[lessonId];
        const xpEarned = previous ? 0 : xp;
        const isNewDay = last !== today;
        const newTodayXp = isNewDay ? xpEarned : get().todayXp + xpEarned;
        set({
          totalXp: get().totalXp + xpEarned,
          todayXp: newTodayXp,
          streakDays: nextStreak,
          lastActiveDate: today,
          lessons: {
            ...get().lessons,
            [lessonId]: {
              completedAt: today,
              xpEarned: previous?.xpEarned ?? xp,
              bestScore:
                score !== undefined
                  ? Math.max(previous?.bestScore ?? 0, score)
                  : previous?.bestScore,
            },
          },
        });
      },
      resetAll: () =>
        set({
          totalXp: 0,
          todayXp: 0,
          streakDays: 0,
          lastActiveDate: null,
          lessons: {},
        }),
    }),
    {
      name: STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
