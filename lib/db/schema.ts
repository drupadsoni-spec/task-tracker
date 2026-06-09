import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";

export const TASK_STATUSES = ["backlog", "todo", "in_progress", "done"] as const;
export const TASK_PRIORITIES = ["none", "low", "medium", "high", "urgent"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export type RecurrenceFrequency = "daily" | "weekly" | "monthly";

export type RecurrenceRule = {
  frequency: RecurrenceFrequency;
  interval: number;
  weekdays?: number[];
};

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").notNull().default("#4f46e5"),
  archived: integer("archived", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  parentTaskId: integer("parent_task_id"),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().$type<TaskStatus>().default("todo"),
  priority: text("priority").notNull().$type<TaskPriority>().default("none"),
  dueDate: text("due_date"),
  recurrenceRule: text("recurrence_rule"),
  sortOrder: integer("sort_order").notNull().default(0),
  completedAt: text("completed_at"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const labels = sqliteTable("labels", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  color: text("color").notNull().default("#6366f1"),
});

export const taskLabels = sqliteTable(
  "task_labels",
  {
    taskId: integer("task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    labelId: integer("label_id")
      .notNull()
      .references(() => labels.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.taskId, table.labelId] }),
  })
);

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Label = typeof labels.$inferSelect;
export type NewLabel = typeof labels.$inferInsert;
