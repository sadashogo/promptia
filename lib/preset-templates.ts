import presetData from "@/content/preset-templates.json";
import type { PromptTag } from "./prompt-tags";

export interface PresetTemplate {
  id: string;
  title: string;
  tag: PromptTag;
  description?: string;
  template: string;
  example?: string;
}

export const PRESET_TEMPLATES: PresetTemplate[] = presetData as PresetTemplate[];

export function getPresetTemplate(id: string): PresetTemplate | undefined {
  return PRESET_TEMPLATES.find((p) => p.id === id);
}

// Use this as fromLessonId so saving a preset to library marks it as "saved"
export function presetSaveKey(presetId: string): string {
  return `preset:${presetId}`;
}
