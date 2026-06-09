import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { deleteLabel, getLabelById, updateLabel } from "@/lib/services/labels";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    getDb();
    const { id } = await params;
    const label = getLabelById(Number(id));
    if (!label) {
      return NextResponse.json({ error: "Label not found" }, { status: 404 });
    }
    return NextResponse.json(label);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch label" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    getDb();
    const { id } = await params;
    const body = await request.json();
    const label = updateLabel(Number(id), body);
    if (!label) {
      return NextResponse.json({ error: "Label not found" }, { status: 404 });
    }
    return NextResponse.json(label);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update label" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    getDb();
    const { id } = await params;
    const label = deleteLabel(Number(id));
    if (!label) {
      return NextResponse.json({ error: "Label not found" }, { status: 404 });
    }
    return NextResponse.json(label);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete label" }, { status: 500 });
  }
}
