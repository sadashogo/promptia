import { ProfileView } from "@/components/profile/ProfileView";
import { getAllUnits, getLessonsForUnit } from "@/lib/content";

export default function ProfilePage() {
  const units = getAllUnits();
  const unit = units[0];
  const lessons = getLessonsForUnit(unit.id);

  return (
    <div className="min-h-dvh bg-stone-50">
      <ProfileView lessons={lessons} />
    </div>
  );
}
