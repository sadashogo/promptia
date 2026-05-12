import { notFound } from "next/navigation";
import { LessonRunner } from "@/components/lesson/LessonRunner";
import { getLesson } from "@/lib/content";

export default async function LessonPage(props: PageProps<"/lesson/[id]">) {
  const { id } = await props.params;
  const lesson = getLesson(id);
  if (!lesson) notFound();

  return (
    <div className="min-h-dvh bg-stone-50">
      <LessonRunner lesson={lesson} />
    </div>
  );
}
