import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { completeTask } from "@/lib/services/tasks";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  try {
    getDb();
    const { id } = await params;
    const task = completeTask(Number(id));
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json(task);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to complete task" }, { status: 500 });
  }
}
