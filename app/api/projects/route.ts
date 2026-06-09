import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createProject, listProjects } from "@/lib/services/projects";

export async function GET(request: Request) {
  try {
    getDb();
    const { searchParams } = new URL(request.url);
    const includeArchived = searchParams.get("includeArchived") === "true";
    return NextResponse.json(listProjects(includeArchived));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    getDb();
    const body = await request.json();
    const project = createProject(body);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
