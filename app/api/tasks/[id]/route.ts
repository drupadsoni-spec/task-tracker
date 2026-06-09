import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { deleteTask, getTaskById, updateTask } from "@/lib/services/tasks";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    getDb();
    const { id } = await params;
    const task = getTaskById(Number(id));
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json(task);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    getDb();
    const { id } = await params;
    const body = await request.json();
    const task = updateTask(Number(id), body);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json(task);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    getDb();
    const { id } = await params;
    deleteTask(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
