import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createLabel, listLabels } from "@/lib/services/labels";

export async function GET() {
  try {
    getDb();
    return NextResponse.json(listLabels());
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch labels" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    getDb();
    const body = await request.json();
    const label = createLabel(body);
    return NextResponse.json(label, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create label" }, { status: 500 });
  }
}
