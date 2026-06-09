import { eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { projects, tasks, type NewProject } from "@/lib/db/schema";

export type ProjectWithCounts = {
  id: number;
  name: string;
  description: string | null;
  color: string;
  archived: boolean;
  sortOrder: number;
  createdAt: string;
  taskCount: number;
  doneCount: number;
};

export function listProjects(includeArchived = false): ProjectWithCounts[] {
  const db = getDb();
  const allProjects = db
    .select()
    .from(projects)
    .orderBy(projects.sortOrder, projects.name)
    .all()
    .filter((p) => includeArchived || !p.archived);

  return allProjects.map((project) => {
    const counts = db
      .select({
        total: sql<number>`count(*)`,
        done: sql<number>`sum(case when ${tasks.status} = 'done' then 1 else 0 end)`,
      })
      .from(tasks)
      .where(eq(tasks.projectId, project.id))
      .get();

    return {
      ...project,
      taskCount: counts?.total ?? 0,
      doneCount: counts?.done ?? 0,
    };
  });
}

export function getProjectById(id: number) {
  const db = getDb();
  return db.select().from(projects).where(eq(projects.id, id)).get();
}

export function createProject(data: NewProject) {
  const db = getDb();
  const maxOrder = db
    .select({ max: sql<number>`coalesce(max(${projects.sortOrder}), -1)` })
    .from(projects)
    .get();
  return db
    .insert(projects)
    .values({
      ...data,
      sortOrder: data.sortOrder ?? (maxOrder?.max ?? -1) + 1,
    })
    .returning()
    .get();
}

export function updateProject(id: number, data: Partial<NewProject>) {
  const db = getDb();
  return db.update(projects).set(data).where(eq(projects.id, id)).returning().get();
}

export function archiveProject(id: number) {
  return updateProject(id, { archived: true });
}
