"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Pio } from "./Pio";
import type { PioMood } from "./types";

interface PioBubbleProps {
  mood?: PioMood;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

const SIZE_PX: Record<NonNullable<PioBubbleProps["size"]>, number> = {
  sm: 48,
  md: 64,
  lg: 96,
};

export function PioBubble({
  mood = "normal",
  size = "sm",
  children,
  className,
}: PioBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex items-start gap-3", className)}
    >
      <div className="shrink-0">
        <Pio mood={mood} size={SIZE_PX[size]} />
      </div>
      <div className="relative max-w-prose flex-1 rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-relaxed text-stone-800 shadow-sm ring-1 ring-stone-200">
        {children}
      </div>
    </motion.div>
  );
}
