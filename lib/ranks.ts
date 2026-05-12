export interface Rank {
  title: string;
  minXp: number;
  badge: string;
  colorClass: string;
  bgClass: string;
  ringClass: string;
}

export const RANKS: Rank[] = [
  { title: "見習い",    minXp: 0,    badge: "🌱", colorClass: "text-stone-600",   bgClass: "bg-stone-100",   ringClass: "ring-stone-300" },
  { title: "旅人",      minXp: 100,  badge: "🌿", colorClass: "text-teal-700",    bgClass: "bg-teal-50",     ringClass: "ring-teal-300" },
  { title: "職人",      minXp: 300,  badge: "⚡", colorClass: "text-amber-700",   bgClass: "bg-amber-50",    ringClass: "ring-amber-300" },
  { title: "マスター",  minXp: 600,  badge: "🔮", colorClass: "text-purple-700",  bgClass: "bg-purple-50",   ringClass: "ring-purple-300" },
  { title: "レジェンド",minXp: 1000, badge: "✨", colorClass: "text-emerald-700", bgClass: "bg-emerald-50",  ringClass: "ring-emerald-300" },
];

export const DAILY_GOAL_XP = 50;

export function getRank(xp: number): Rank {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.minXp) rank = r;
  }
  return rank;
}

export function getNextRank(xp: number): Rank | null {
  return RANKS.find((r) => r.minXp > xp) ?? null;
}

export function rankProgress(xp: number): number {
  const current = getRank(xp);
  const next = getNextRank(xp);
  if (!next) return 1;
  const range = next.minXp - current.minXp;
  const earned = xp - current.minXp;
  return Math.min(earned / range, 1);
}
