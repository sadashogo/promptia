"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, BookOpen, Search, Sparkles, Star } from "lucide-react";
import { useProgress } from "@/lib/store";
import {
  ALL_TAGS,
  getTagInfo,
  type PromptTag,
} from "@/lib/prompt-tags";
import { PRESET_TEMPLATES } from "@/lib/preset-templates";
import { cn } from "@/lib/utils";
import { PromptCard } from "./PromptCard";
import { PresetCard } from "./PresetCard";

type Tab = "preset" | "saved";

export function LibraryView() {
  const savedPrompts = useProgress((s) => s.savedPrompts);
  const removeSavedPrompt = useProgress((s) => s.removeSavedPrompt);
  const hasHydrated = useProgress((s) => s.hasHydrated);
  const [tab, setTab] = useState<Tab>("preset");
  const [tagFilter, setTagFilter] = useState<PromptTag | "all">("all");
  const [query, setQuery] = useState("");

  const prompts = hasHydrated ? savedPrompts : [];
  const presets = PRESET_TEMPLATES;

  const activeList: { tag: PromptTag; title: string; template: string }[] =
    tab === "saved" ? prompts : presets;

  const visibleTags = useMemo(() => {
    const inUse = new Set<PromptTag>();
    activeList.forEach((p) => inUse.add(p.tag));
    return ALL_TAGS.filter((t) => inUse.has(t));
  }, [activeList]);

  const filteredSaved = useMemo(() => {
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

  const filteredPresets = useMemo(() => {
    let list = presets;
    if (tagFilter !== "all") list = list.filter((p) => p.tag === tagFilter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q) ||
          p.template.toLowerCase().includes(q),
      );
    }
    return list;
  }, [presets, tagFilter, query]);

  const handleTabChange = (next: Tab) => {
    setTab(next);
    setTagFilter("all");
    setQuery("");
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col">
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/80 backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-3">
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
              プロンプト集
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1 px-3 pb-2">
          <TabButton
            active={tab === "preset"}
            onClick={() => handleTabChange("preset")}
            icon={<Star className="h-4 w-4" />}
            label="テンプレ集"
            count={presets.length}
          />
          <TabButton
            active={tab === "saved"}
            onClick={() => handleTabChange("saved")}
            icon={<BookOpen className="h-4 w-4" />}
            label="マイ集"
            count={prompts.length}
          />
        </div>
      </header>

      <main className="flex-1 px-4 py-5">
        {tab === "saved" ? (
          prompts.length === 0 ? (
            <SavedEmptyState />
          ) : (
            <ListSection
              query={query}
              onQueryChange={setQuery}
              tagFilter={tagFilter}
              onTagChange={setTagFilter}
              visibleTags={visibleTags}
              tagCounts={(t) => prompts.filter((p) => p.tag === t).length}
              total={prompts.length}
            >
              {filteredSaved.length === 0 ? (
                <NoMatchState />
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredSaved.map((p) => (
                    <PromptCard
                      key={p.id}
                      prompt={p}
                      onRemove={removeSavedPrompt}
                    />
                  ))}
                </div>
              )}
            </ListSection>
          )
        ) : (
          <ListSection
            query={query}
            onQueryChange={setQuery}
            tagFilter={tagFilter}
            onTagChange={setTagFilter}
            visibleTags={visibleTags}
            tagCounts={(t) => presets.filter((p) => p.tag === t).length}
            total={presets.length}
            intro={
              <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50/60 px-3 py-2.5 text-xs leading-relaxed text-emerald-900">
                すぐ実務で使える業務テンプレを{presets.length}個用意しました。気に入ったらマイ集に保存しておくと、いつでもサッと取り出せます。
              </div>
            }
          >
            {filteredPresets.length === 0 ? (
              <NoMatchState />
            ) : (
              <div className="flex flex-col gap-3">
                {filteredPresets.map((p) => (
                  <PresetCard key={p.id} preset={p} />
                ))}
              </div>
            )}
          </ListSection>
        )}
      </main>
    </div>
  );
}

interface ListSectionProps {
  query: string;
  onQueryChange: (q: string) => void;
  tagFilter: PromptTag | "all";
  onTagChange: (t: PromptTag | "all") => void;
  visibleTags: PromptTag[];
  tagCounts: (t: PromptTag) => number;
  total: number;
  intro?: React.ReactNode;
  children: React.ReactNode;
}

function ListSection({
  query,
  onQueryChange,
  tagFilter,
  onTagChange,
  visibleTags,
  tagCounts,
  total,
  intro,
  children,
}: ListSectionProps) {
  return (
    <>
      {intro}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="テンプレを検索..."
          className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {visibleTags.length > 1 && (
        <div className="mb-4 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          <TagChip
            active={tagFilter === "all"}
            onClick={() => onTagChange("all")}
            label="すべて"
            emoji="📚"
            count={total}
          />
          {visibleTags.map((t) => {
            const info = getTagInfo(t);
            return (
              <TagChip
                key={t}
                active={tagFilter === t}
                onClick={() => onTagChange(t)}
                label={info.label}
                emoji={info.emoji}
                count={tagCounts(t)}
              />
            );
          })}
        </div>
      )}

      {children}
    </>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-bold transition-colors",
        active
          ? "bg-emerald-500 text-white"
          : "bg-stone-100 text-stone-600 hover:bg-stone-200",
      )}
    >
      {icon}
      <span>{label}</span>
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-[10px]",
          active ? "bg-white/25 text-white" : "bg-white text-stone-500",
        )}
      >
        {count}
      </span>
    </button>
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
      <span
        className={cn(
          "ml-1.5 text-[10px] font-bold",
          active ? "text-white/80" : "text-stone-400",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function SavedEmptyState() {
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
          上の「テンプレ集」タブから気に入ったものを保存するか、レッスンをクリアして自動的に追加されたテンプレを集めましょう。
        </p>
      </div>
    </div>
  );
}

function NoMatchState() {
  return (
    <div className="rounded-xl border border-dashed border-stone-300 bg-white py-8 text-center text-sm text-stone-500">
      該当するテンプレがありません
    </div>
  );
}
