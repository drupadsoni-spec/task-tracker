import { eq } from "drizzle-orm";
import type { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

export function seedDefaults(db: ReturnType<typeof drizzle<typeof schema>>) {
  const inbox = db
    .select()
    .from(schema.projects)
    .where(eq(schema.projects.name, "Inbox"))
    .get();

  if (!inbox) {
    db.insert(schema.projects)
      .values({
        name: "Inbox",
        description: "Default project for uncategorized tasks",
        color: "#4f46e5",
        sortOrder: 0,
      })
      .run();
  }
}
