import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getDashboardStats } from "@/lib/services/dashboard";

export async function GET() {
  try {
    getDb();
    return NextResponse.json(getDashboardStats());
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
  }
}
