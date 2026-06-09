import { TodayView } from "@/components/today/today-view";
import { getDb } from "@/lib/db";
import { listTasks } from "@/lib/services/tasks";

export const dynamic = "force-dynamic";

export default function TodayPage() {
  getDb();
  const todayTasks = listTasks({ due: "today", topLevelOnly: true });
  const overdueTasks = listTasks({ due: "overdue", topLevelOnly: true });

  return <TodayView todayTasks={todayTasks} overdueTasks={overdueTasks} />;
}
