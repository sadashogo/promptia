"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, Trash2 } from "lucide-react";
import type { SavedPrompt } from "@/lib/types";
import { getTagInfo } from "@/lib/prompt-tags";
import { cn } from "@/lib/utils";

interface PromptCardProps {
  prompt: SavedPrompt;
  onRemove: (id: string) => void;
}

export function PromptCard({ prompt, onRemove }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const tagInfo = getTagInfo(prompt.tag);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.template);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ring-1",
                tagInfo.bgClass,
                tagInfo.textClass,
                tagInfo.ringClass,
              )}
            >
              <span>{tagInfo.emoji}</span>
              <span>{tagInfo.label}</span>
            </span>
            <span className="text-[10px] text-stone-400">{prompt.savedAt}</span>
          </div>
          <div className="text-sm font-bold text-stone-900">{prompt.title}</div>
        </div>
        <button
          type="button"
          onClick={() => setConfirmDel(true)}
          className="rounded-md p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600"
          aria-label="削除"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <pre className="mb-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-stone-50 p-3 font-mono text-[12px] leading-relaxed text-stone-800 ring-1 ring-stone-200">
        {prompt.template}
      </pre>

      {prompt.example && (
        <div className="mb-3">
          <button
            type="button"
            onClick={() => setShowExample((v) => !v)}
            className="text-xs font-semibold text-emerald-700 underline-offset-2 hover:underline"
          >
            {showExample ? "例を閉じる" : "▸ 埋めた例を見る"}
          </button>
          {showExample && (
            <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-emerald-50/50 p-3 font-mono text-[12px] leading-relaxed text-stone-800 ring-1 ring-emerald-100">
              {prompt.example}
            </pre>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all active:scale-[0.98]",
            copied
              ? "bg-emerald-500 text-white"
              : "bg-stone-100 text-stone-700 hover:bg-stone-200",
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
        {prompt.fromLessonId && (
          <Link
            href={`/lesson/${prompt.fromLessonId}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-200"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            元レッスン
          </Link>
        )}
      </div>

      {confirmDel && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-2 text-xs">
          <span className="flex-1 text-rose-900">このテンプレを削除？</span>
          <button
            type="button"
            onClick={() => setConfirmDel(false)}
            className="rounded-md bg-white px-2 py-1 font-semibold text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50"
          >
            やめる
          </button>
          <button
            type="button"
            onClick={() => onRemove(prompt.id)}
            className="rounded-md bg-rose-500 px-2 py-1 font-bold text-white hover:bg-rose-600"
          >
            削除
          </button>
        </div>
      )}
    </div>
  );
}
