import { LabelManager } from "@/components/labels/label-manager";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function LabelsPage() {
  getDb();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Labels</h1>
        <p className="text-muted-foreground">Tag and filter tasks by label</p>
      </div>
      <LabelManager />
    </div>
  );
}
