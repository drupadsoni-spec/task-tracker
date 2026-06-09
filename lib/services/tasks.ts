import { and, eq, gte, isNull, lte, or, sql } from "drizzle-orm";
import { addDays, format } from "date-fns";
import { getDb } from "@/lib/db";
import {
  labels,
  projects,
  taskLabels,
  tasks,
  type Label,
  type NewTask,
  type RecurrenceRule,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/db/schema";
import { getLabelsForTask, setTaskLabels } from "@/lib/services/labels";
import {
  computeNextDueDate,
  parseRecurrenceRule,
  serializeRecurrenceRule,
} from "@/lib/services/recurrence";

export type TaskWithMeta = Task & {
  labels: Label[];
  subtaskCount: number;
  subtasksDone: number;
  projectName?: string;
  projectColor?: string;
};

export type TaskFilters = {
  projectId?: number;
  status?: TaskStatus;
  labelId?: number;
  due?: "today" | "overdue" | "upcoming";
  q?: string;
  topLevelOnly?: boolean;
  parentTaskId?: number;
};

function enrichTask(task: Task): TaskWithMeta {
  const db = getDb();
  const taskLabelRows = getLabelsForTask(task.id);
  const subtasks = db
    .select()
    .from(tasks)
    .where(eq(tasks.parentTaskId, task.id))
    .all();

  return {
    ...task,
    labels: taskLabelRows,
    subtaskCount: subtasks.length,
    subtasksDone: subtasks.filter((s) => s.status === "done").length,
  };
}

function enrichTasksWithProject(tasksList: Task[]): TaskWithMeta[] {
  const db = getDb();
  return tasksList.map((task) => {
    const enriched = enrichTask(task);
    const project = db
      .select()
      .from(projects)
      .where(eq(projects.id, task.projectId))
      .get();
    return {
      ...enriched,
      projectName: project?.name,
      projectColor: project?.color,
    };
  });
}

export function listTasks(filters: TaskFilters = {}): TaskWithMeta[] {
  const db = getDb();
  let query = db.select().from(tasks).$dynamic();

  const conditions = [];

  if (filters.projectId !== undefined) {
    conditions.push(eq(tasks.projectId, filters.projectId));
  }
  if (filters.status) {
    conditions.push(eq(tasks.status, filters.status));
  }
  if (filters.topLevelOnly) {
    conditions.push(isNull(tasks.parentTaskId));
  }
  if (filters.parentTaskId !== undefined) {
    conditions.push(eq(tasks.parentTaskId, filters.parentTaskId));
  }
  if (filters.due === "today") {
    const today = format(new Date(), "yyyy-MM-dd");
    conditions.push(eq(tasks.dueDate, today));
    conditions.push(sql`${tasks.status} != 'done'`);
  }
  if (filters.due === "overdue") {
    const today = format(new Date(), "yyyy-MM-dd");
    conditions.push(lte(tasks.dueDate, today));
    conditions.push(sql`${tasks.status} != 'done'`);
    conditions.push(sql`${tasks.dueDate} is not null`);
  }
  if (filters.due === "upcoming") {
    const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
    const weekAhead = format(addDays(new Date(), 7), "yyyy-MM-dd");
    conditions.push(gte(tasks.dueDate, tomorrow));
    conditions.push(lte(tasks.dueDate, weekAhead));
    conditions.push(sql`${tasks.status} != 'done'`);
    conditions.push(sql`${tasks.dueDate} is not null`);
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  let results = query.orderBy(tasks.sortOrder, tasks.createdAt).all();

  if (filters.q) {
    const needle = filters.q.toLowerCase();
    results = results.filter(
      (t) =>
        t.title.toLowerCase().includes(needle) ||
        (t.description?.toLowerCase().includes(needle) ?? false)
    );
  }

  if (filters.labelId !== undefined) {
    const taskIdsWithLabel = db
      .select({ taskId: taskLabels.taskId })
      .from(taskLabels)
      .where(eq(taskLabels.labelId, filters.labelId))
      .all()
      .map((r) => r.taskId);
    results = results.filter((t) => taskIdsWithLabel.includes(t.id));
  }

  return enrichTasksWithProject(results);
}

export function getTaskById(id: number): TaskWithMeta | undefined {
  const db = getDb();
  const task = db.select().from(tasks).where(eq(tasks.id, id)).get();
  if (!task) return undefined;
  return enrichTasksWithProject([task])[0];
}

export function listSubtasks(parentTaskId: number): TaskWithMeta[] {
  return listTasks({ parentTaskId });
}

export type CreateTaskInput = Omit<NewTask, "recurrenceRule"> & {
  labelIds?: number[];
  recurrenceRule?: RecurrenceRule | null;
};

export function createTask(data: CreateTaskInput) {
  const db = getDb();
  const { labelIds, recurrenceRule, ...taskData } = data;

  const maxOrder = db
    .select({ max: sql<number>`coalesce(max(${tasks.sortOrder}), -1)` })
    .from(tasks)
    .where(
      and(
        eq(tasks.projectId, taskData.projectId),
        taskData.parentTaskId
          ? eq(tasks.parentTaskId, taskData.parentTaskId)
          : isNull(tasks.parentTaskId),
        eq(tasks.status, taskData.status ?? "todo")
      )
    )
    .get();

  const result = db
    .insert(tasks)
    .values({
      ...taskData,
      recurrenceRule: serializeRecurrenceRule(recurrenceRule ?? null),
      sortOrder: taskData.sortOrder ?? (maxOrder?.max ?? -1) + 1,
      updatedAt: new Date().toISOString(),
    })
    .returning()
    .get();

  if (labelIds && labelIds.length > 0) {
    setTaskLabels(result.id, labelIds);
  }

  return getTaskById(result.id)!;
}

export type UpdateTaskInput = Partial<Omit<NewTask, "recurrenceRule">> & {
  labelIds?: number[];
  recurrenceRule?: RecurrenceRule | null;
};

export function updateTask(id: number, data: UpdateTaskInput) {
  const db = getDb();
  const { labelIds, recurrenceRule, ...taskData } = data;

  const updates: Partial<NewTask> & { updatedAt: string } = {
    ...taskData,
    updatedAt: new Date().toISOString(),
  };

  if (recurrenceRule !== undefined) {
    updates.recurrenceRule = serializeRecurrenceRule(recurrenceRule);
  }

  db.update(tasks).set(updates).where(eq(tasks.id, id)).run();

  if (labelIds !== undefined) {
    setTaskLabels(id, labelIds);
  }

  return getTaskById(id);
}

export function deleteTask(id: number) {
  const db = getDb();
  db.delete(tasks).where(or(eq(tasks.id, id), eq(tasks.parentTaskId, id))).run();
}

export function completeTask(id: number) {
  const db = getDb();
  const task = db.select().from(tasks).where(eq(tasks.id, id)).get();
  if (!task) return null;

  const now = new Date().toISOString();
  db.update(tasks)
    .set({ status: "done", completedAt: now, updatedAt: now })
    .where(eq(tasks.id, id))
    .run();

  const rule = parseRecurrenceRule(task.recurrenceRule);
  if (rule) {
    const nextDueDate = computeNextDueDate(rule, task.dueDate);
    createTask({
      projectId: task.projectId,
      parentTaskId: task.parentTaskId,
      title: task.title,
      description: task.description,
      status: "todo",
      priority: task.priority as TaskPriority,
      dueDate: nextDueDate,
      recurrenceRule: rule,
      labelIds: getLabelsForTask(task.id).map((l) => l.id),
    });
  }

  return getTaskById(id);
}

export function moveTask(
  id: number,
  status: TaskStatus,
  sortOrder: number
) {
  return updateTask(id, { status, sortOrder });
}

