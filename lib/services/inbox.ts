import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { projects } from "@/lib/db/schema";

export function getInboxProject() {
  const db = getDb();
  return db.select().from(projects).where(eq(projects.name, "Inbox")).get();
}

export function getInboxProjectId() {
  return getInboxProject()?.id ?? null;
}
