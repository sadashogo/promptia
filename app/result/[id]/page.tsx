import { notFound } from "next/navigation";
import { ResultView } from "@/components/lesson/ResultView";
import { getLesson, getNextLessonId } from "@/lib/content";

export default async function ResultPage(props: PageProps<"/result/[id]">) {
  const { id } = await props.params;
  const search = await props.searchParams;
  const lesson = getLesson(id);
  if (!lesson) notFound();

  const correct = Number(asString(search.correct) ?? 0);
  const total = Number(asString(search.total) ?? 0);
  const xp = Number(asString(search.xp) ?? lesson.rewards.xp);
  const nextLessonId = getNextLessonId(lesson.id);

  return (
    <div className="min-h-dvh bg-stone-50">
      <ResultView
        lessonId={lesson.id}
        lessonTitle={lesson.title}
        correct={correct}
        total={total}
        xp={xp}
        nextLessonId={nextLessonId}
        practicalTemplate={lesson.practicalTemplate}
      />
    </div>
  );
}

function asString(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}
