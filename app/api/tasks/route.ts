import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { TaskStatus } from "@/lib/db/schema";
import { createTask, listTasks } from "@/lib/services/tasks";

export async function GET(request: Request) {
  try {
    getDb();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status") as TaskStatus | null;
    const labelId = searchParams.get("labelId");
    const due = searchParams.get("due") as "today" | "overdue" | "upcoming" | null;
    const q = searchParams.get("q") ?? undefined;
    const topLevelOnly = searchParams.get("topLevelOnly") !== "false";
    const parentTaskId = searchParams.get("parentTaskId");

    const tasks = listTasks({
      projectId: projectId ? Number(projectId) : undefined,
      status: status ?? undefined,
      labelId: labelId ? Number(labelId) : undefined,
      due: due ?? undefined,
      q,
      topLevelOnly: parentTaskId ? false : topLevelOnly,
      parentTaskId: parentTaskId ? Number(parentTaskId) : undefined,
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    getDb();
    const body = await request.json();
    const task = createTask(body);
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
