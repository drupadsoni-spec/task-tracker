import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getInboxProject } from "@/lib/services/inbox";

export async function GET() {
  try {
    getDb();
    const inbox = getInboxProject();
    if (!inbox) {
      return NextResponse.json({ error: "Inbox not found" }, { status: 404 });
    }
    return NextResponse.json(inbox);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch inbox" }, { status: 500 });
  }
}
