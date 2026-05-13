"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, BookOpen, Search, Sparkles } from "lucide-react";
import { useProgress } from "@/lib/store";
import {
  ALL_TAGS,
  getTagInfo,
  type PromptTag,
} from "@/lib/prompt-tags";
import { cn } from "@/lib/utils";
import { PromptCard } from "./PromptCard";

export function LibraryView() {
  const savedPrompts = useProgress((s) => s.savedPrompts);
  const removeSavedPrompt = useProgress((s) => s.removeSavedPrompt);
  const hasHydrated = useProgress((s) => s.hasHydrated);
  const [tagFilter, setTagFilter] = useState<PromptTag | "all">("all");
  const [query, setQuery] = useState("");

  const prompts = hasHydrated ? savedPrompts : [];

  const visibleTags = useMemo(() => {
    const inUse = new Set<PromptTag>();
    prompts.forEach((p) => inUse.add(p.tag));
    return ALL_TAGS.filter((t) => inUse.has(t));
  }, [prompts]);

  const filtered = useMemo(() => {
    let list = prompts;
    if (tagFilter !== "all") list = list.filter((p) => p.tag === tagFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.template.toLowerCase().includes(q),
      );
    }
    return list;
  }, [prompts, tagFilter, query]);

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
        <div className="flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-emerald-600" />
          <div className="text-base font-bold text-stone-900">
            マイプロンプト集
          </div>
          {prompts.length > 0 && (
            <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
              {prompts.length}
            </span>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 py-5">
        {prompts.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="mb-3 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="テンプレを検索..."
                className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {visibleTags.length > 1 && (
              <div className="mb-4 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
                <TagChip
                  active={tagFilter === "all"}
                  onClick={() => setTagFilter("all")}
                  label="すべて"
                  emoji="📚"
                  count={prompts.length}
                />
                {visibleTags.map((t) => {
                  const info = getTagInfo(t);
                  const count = prompts.filter((p) => p.tag === t).length;
                  return (
                    <TagChip
                      key={t}
                      active={tagFilter === t}
                      onClick={() => setTagFilter(t)}
                      label={info.label}
                      emoji={info.emoji}
                      count={count}
                    />
                  );
                })}
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-stone-300 bg-white py-8 text-center text-sm text-stone-500">
                該当するテンプレがありません
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map((p) => (
                  <PromptCard
                    key={p.id}
                    prompt={p}
                    onRemove={removeSavedPrompt}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function TagChip({
  active,
  onClick,
  label,
  emoji,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  emoji: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ring-1 transition-colors",
        active
          ? "bg-emerald-500 text-white ring-emerald-500"
          : "bg-white text-stone-700 ring-stone-200 hover:bg-stone-50",
      )}
    >
      <span className="mr-1">{emoji}</span>
      {label}
      <span className={cn("ml-1.5 text-[10px] font-bold", active ? "text-white/80" : "text-stone-400")}>
        {count}
      </span>
    </button>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto mt-10 flex max-w-sm flex-col items-center gap-4 rounded-2xl border border-stone-200 bg-white p-6 text-center">
      <div className="rounded-full bg-emerald-100 p-3">
        <Sparkles className="h-6 w-6 text-emerald-600" />
      </div>
      <div>
        <div className="text-base font-bold text-stone-900">
          まだテンプレが保存されていません
        </div>
        <p className="mt-2 text-sm text-stone-600">
          レッスンをクリアすると、結果画面に「今日のテンプレート」が出ます。
          気に入ったものを保存すれば、ここからいつでもコピーして仕事で使えます。
        </p>
      </div>
      <Link
        href="/lesson/lesson-01-greeting"
        className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-600"
      >
        レッスン1から始める
      </Link>
    </div>
  );
}
