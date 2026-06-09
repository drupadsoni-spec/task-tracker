import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { labels, taskLabels, type NewLabel } from "@/lib/db/schema";

export function listLabels() {
  const db = getDb();
  return db.select().from(labels).orderBy(labels.name).all();
}

export function getLabelById(id: number) {
  const db = getDb();
  return db.select().from(labels).where(eq(labels.id, id)).get();
}

export function createLabel(data: NewLabel) {
  const db = getDb();
  return db.insert(labels).values(data).returning().get();
}

export function updateLabel(id: number, data: Partial<NewLabel>) {
  const db = getDb();
  return db.update(labels).set(data).where(eq(labels.id, id)).returning().get();
}

export function deleteLabel(id: number) {
  const db = getDb();
  db.delete(taskLabels).where(eq(taskLabels.labelId, id)).run();
  return db.delete(labels).where(eq(labels.id, id)).returning().get();
}

export function getLabelsForTask(taskId: number) {
  const db = getDb();
  return db
    .select({ label: labels })
    .from(taskLabels)
    .innerJoin(labels, eq(taskLabels.labelId, labels.id))
    .where(eq(taskLabels.taskId, taskId))
    .all()
    .map((row) => row.label);
}

export function setTaskLabels(taskId: number, labelIds: number[]) {
  const db = getDb();
  db.delete(taskLabels).where(eq(taskLabels.taskId, taskId)).run();
  for (const labelId of labelIds) {
    db.insert(taskLabels).values({ taskId, labelId }).run();
  }
  return getLabelsForTask(taskId);
}
