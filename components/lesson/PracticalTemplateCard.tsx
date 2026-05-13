"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookmarkPlus, Check, Copy, FileText } from "lucide-react";
import type { PracticalTemplate } from "@/lib/types";
import { useProgress } from "@/lib/store";
import { getTagInfo } from "@/lib/prompt-tags";
import { cn } from "@/lib/utils";

interface PracticalTemplateCardProps {
  template: PracticalTemplate;
  fromLessonId: string;
}

export function PracticalTemplateCard({
  template,
  fromLessonId,
}: PracticalTemplateCardProps) {
  const savePrompt = useProgress((s) => s.savePrompt);
  const isLessonPromptSaved = useProgress((s) => s.isLessonPromptSaved);
  const hasHydrated = useProgress((s) => s.hasHydrated);
  const [copied, setCopied] = useState(false);
  const [showExample, setShowExample] = useState(false);

  const alreadySaved = hasHydrated && isLessonPromptSaved(fromLessonId);
  const tagInfo = getTagInfo(template.tag);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(template.template);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore – clipboard not available
    }
  };

  const handleSave = () => {
    if (alreadySaved) return;
    savePrompt({
      title: template.title,
      tag: template.tag,
      template: template.template,
      example: template.example,
      fromLessonId,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, type: "spring", stiffness: 120, damping: 18 }}
      className="w-full rounded-2xl border-2 border-emerald-200 bg-white p-4 text-left shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-emerald-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            今日のテンプレート
          </span>
        </div>
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
      </div>

      <div className="mb-2 text-base font-bold text-stone-900">
        {template.title}
      </div>

      <pre className="mb-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-stone-50 p-3 font-mono text-[13px] leading-relaxed text-stone-800 ring-1 ring-stone-200">
        {template.template}
      </pre>

      {template.example && (
        <div className="mb-3">
          <button
            type="button"
            onClick={() => setShowExample((v) => !v)}
            className="text-xs font-semibold text-emerald-700 underline-offset-2 hover:underline"
          >
            {showExample ? "例を閉じる" : "▸ 埋めた例を見る"}
          </button>
          {showExample && (
            <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-emerald-50/50 p-3 font-mono text-[13px] leading-relaxed text-stone-800 ring-1 ring-emerald-100">
              {template.example}
            </pre>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 py-2.5 text-sm font-bold transition-all active:scale-[0.98]",
            copied
              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
              : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50",
          )}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              コピーしました
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              コピー
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={alreadySaved}
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-bold transition-all active:scale-[0.98]",
            alreadySaved
              ? "cursor-default bg-stone-100 text-stone-500"
              : "bg-emerald-500 text-white hover:bg-emerald-600",
          )}
        >
          {alreadySaved ? (
            <>
              <Check className="h-4 w-4" />
              保存済み
            </>
          ) : (
            <>
              <BookmarkPlus className="h-4 w-4" />
              マイ集に保存
            </>
          )}
        </button>
      </div>

      {alreadySaved && (
        <div className="mt-3 text-center text-[11px] text-stone-500">
          <Link
            href="/library"
            className="font-semibold text-emerald-700 underline-offset-2 hover:underline"
          >
            マイプロンプト集を開く →
          </Link>
        </div>
      )}
    </motion.div>
  );
}
