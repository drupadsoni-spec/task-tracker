import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { getInboxProjectId } from "@/lib/services/inbox";

export const dynamic = "force-dynamic";

export default function InboxPage() {
  getDb();
  const inboxId = getInboxProjectId();
  if (!inboxId) redirect("/projects");
  redirect(`/projects/${inboxId}`);
}
