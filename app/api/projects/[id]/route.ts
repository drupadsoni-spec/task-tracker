import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  archiveProject,
  getProjectById,
  updateProject,
} from "@/lib/services/projects";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    getDb();
    const { id } = await params;
    const project = getProjectById(Number(id));
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    getDb();
    const { id } = await params;
    const body = await request.json();
    const project = updateProject(Number(id), body);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    getDb();
    const { id } = await params;
    const project = archiveProject(Number(id));
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to archive project" }, { status: 500 });
  }
}
