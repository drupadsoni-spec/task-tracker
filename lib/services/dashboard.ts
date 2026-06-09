import { and, eq, isNull, sql } from "drizzle-orm";
import { format } from "date-fns";
import { getDb } from "@/lib/db";
import { projects, tasks } from "@/lib/db/schema";
import { listProjects } from "@/lib/services/projects";
import { listTasks } from "@/lib/services/tasks";

export function getDashboardStats() {
  const today = format(new Date(), "yyyy-MM-dd");
  const db = getDb();

  const todayTasks = listTasks({ due: "today", topLevelOnly: true });
  const overdueTasks = listTasks({ due: "overdue", topLevelOnly: true });
  const activeProjects = listProjects().filter((p) => !p.archived);
  const inProgress = db
    .select({ count: sql<number>`count(*)` })
    .from(tasks)
    .where(and(eq(tasks.status, "in_progress"), isNull(tasks.parentTaskId)))
    .get();

  const activeProjectCount = db
    .select({ count: sql<number>`count(*)` })
    .from(projects)
    .where(eq(projects.archived, false))
    .get();

  const recentTasks = listTasks({ topLevelOnly: true })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5);

  return {
    todayCount: todayTasks.length,
    overdueCount: overdueTasks.length,
    inProgressCount: inProgress?.count ?? 0,
    projectCount: activeProjectCount?.count ?? activeProjects.length,
    todayTasks,
    overdueTasks,
    activeProjects,
    recentTasks,
    today,
  };
}
