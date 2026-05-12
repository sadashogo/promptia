import type { Lesson, Unit } from "./types";

import unit01 from "@/content/units/unit-01.json";
import lesson01 from "@/content/lessons/lesson-01-greeting.json";
import lesson02 from "@/content/lessons/lesson-02-role.json";
import lesson03 from "@/content/lessons/lesson-03-purpose.json";
import lesson04 from "@/content/lessons/lesson-04-structure.json";
import lesson05 from "@/content/lessons/lesson-05-ideation.json";
import lesson06 from "@/content/lessons/lesson-06-audience.json";
import lesson07 from "@/content/lessons/lesson-07-claude-vs-gemini.json";
import lesson08 from "@/content/lessons/lesson-08-final-challenge.json";

const unitsList: Unit[] = [unit01 as Unit];
const lessonsList: Lesson[] = [
  lesson01 as Lesson,
  lesson02 as Lesson,
  lesson03 as Lesson,
  lesson04 as Lesson,
  lesson05 as Lesson,
  lesson06 as Lesson,
  lesson07 as Lesson,
  lesson08 as Lesson,
];

const unitsById = new Map(unitsList.map((u) => [u.id, u]));
const lessonsById = new Map(lessonsList.map((l) => [l.id, l]));

export function getAllUnits(): Unit[] {
  return unitsList;
}

export function getUnit(id: string): Unit | undefined {
  return unitsById.get(id);
}

export function getLesson(id: string): Lesson | undefined {
  return lessonsById.get(id);
}

export function getLessonsForUnit(unitId: string): Lesson[] {
  const unit = getUnit(unitId);
  if (!unit) return [];
  return unit.lessons
    .map((id) => lessonsById.get(id))
    .filter((l): l is Lesson => Boolean(l));
}

export function getNextLessonId(currentId: string): string | undefined {
  const current = lessonsById.get(currentId);
  if (!current) return undefined;
  const unit = unitsById.get(current.unit);
  if (!unit) return undefined;
  const idx = unit.lessons.indexOf(currentId);
  if (idx < 0 || idx >= unit.lessons.length - 1) return undefined;
  return unit.lessons[idx + 1];
}
