"use client";

import { useState } from "react";
import { BookmarkPlus, Check, Copy } from "lucide-react";
import type { PresetTemplate } from "@/lib/preset-templates";
import { presetSaveKey } from "@/lib/preset-templates";
import { useProgress } from "@/lib/store";
import { getTagInfo } from "@/lib/prompt-tags";
import { cn } from "@/lib/utils";

interface PresetCardProps {
  preset: PresetTemplate;
}

export function PresetCard({ preset }: PresetCardProps) {
  const savePrompt = useProgress((s) => s.savePrompt);
  const isLessonPromptSaved = useProgress((s) => s.isLessonPromptSaved);
  const hasHydrated = useProgress((s) => s.hasHydrated);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const saveKey = presetSaveKey(preset.id);
  const alreadySaved = hasHydrated && isLessonPromptSaved(saveKey);
  const tagInfo = getTagInfo(preset.tag);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(preset.template);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  const handleSave = () => {
    if (alreadySaved) return;
    savePrompt({
      title: preset.title,
      tag: preset.tag,
      template: preset.template,
      example: preset.example,
      fromLessonId: saveKey,
    });
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start gap-2">
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ring-1",
            tagInfo.bgClass,
            tagInfo.textClass,
            tagInfo.ringClass,
          )}
        >
          <span>{tagInfo.emoji}</span>
          <span>{tagInfo.label}</span>
        </span>
      </div>

      <div className="mb-1 text-sm font-bold text-stone-900">{preset.title}</div>
      {preset.description && (
        <p className="mb-3 text-xs leading-relaxed text-stone-600">
          {preset.description}
        </p>
      )}

      <div className="mb-3">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-left text-xs font-semibold text-stone-700 hover:bg-stone-100"
        >
          <span>テンプレ本文を{expanded ? "閉じる" : "見る"}</span>
          <span className="text-stone-400">{expanded ? "▲" : "▼"}</span>
        </button>
        {expanded && (
          <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-stone-50 p-3 font-mono text-[12px] leading-relaxed text-stone-800 ring-1 ring-stone-200">
            {preset.template}
          </pre>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border-2 py-2 text-xs font-bold transition-all active:scale-[0.98]",
            copied
              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
              : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50",
          )}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              コピーした
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              コピー
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={alreadySaved}
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all active:scale-[0.98]",
            alreadySaved
              ? "cursor-default bg-stone-100 text-stone-500"
              : "bg-emerald-500 text-white hover:bg-emerald-600",
          )}
        >
          {alreadySaved ? (
            <>
              <Check className="h-3.5 w-3.5" />
              マイ集に保存済み
            </>
          ) : (
            <>
              <BookmarkPlus className="h-3.5 w-3.5" />
              マイ集に保存
            </>
          )}
        </button>
      </div>
    </div>
  );
}
