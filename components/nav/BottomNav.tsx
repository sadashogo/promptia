"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, User } from "lucide-react";
import { useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  match: (pathname: string) => boolean;
}

const ITEMS: NavItem[] = [
  {
    href: "/",
    label: "ホーム",
    icon: <Home className="h-5 w-5" />,
    match: (p) => p === "/",
  },
  {
    href: "/library",
    label: "プロンプト集",
    icon: <BookOpen className="h-5 w-5" />,
    match: (p) => p.startsWith("/library"),
  },
  {
    href: "/profile",
    label: "プロフィール",
    icon: <User className="h-5 w-5" />,
    match: (p) => p.startsWith("/profile"),
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const savedCount = useProgress((s) => s.savedPrompts.length);
  const hasHydrated = useProgress((s) => s.hasHydrated);
  const saved = hasHydrated ? savedCount : 0;

  return (
    <nav
      className="sticky bottom-0 z-30 mt-auto border-t border-stone-200 bg-white/95 backdrop-blur"
      aria-label="メインナビゲーション"
    >
      <div className="mx-auto grid max-w-xl grid-cols-3">
        {ITEMS.map((item) => {
          const active = item.match(pathname);
          const showBadge = item.href === "/library" && saved > 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors",
                active
                  ? "text-emerald-600"
                  : "text-stone-500 hover:text-stone-800",
              )}
              aria-current={active ? "page" : undefined}
            >
              <div className="relative">
                {item.icon}
                {showBadge && (
                  <span className="absolute -right-2.5 -top-1.5 min-w-[18px] rounded-full bg-emerald-500 px-1 text-center text-[10px] font-bold leading-tight text-white">
                    {saved}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold leading-none">
                {item.label}
              </span>
              {active && (
                <span className="absolute inset-x-6 top-0 h-0.5 rounded-b-full bg-emerald-500" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
