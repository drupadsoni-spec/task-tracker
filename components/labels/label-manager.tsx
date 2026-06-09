"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Label as LabelType } from "@/lib/db/schema";

const LABEL_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
];

export function LabelManager() {
  const [labels, setLabels] = useState<LabelType[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState(LABEL_COLORS[0]);
  const [filterLabelId, setFilterLabelId] = useState<number | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<
    { id: number; title: string; projectName?: string; projectId: number }[]
  >([]);

  async function loadLabels() {
    const res = await fetch("/api/labels");
    if (res.ok) setLabels(await res.json());
  }

  useEffect(() => {
    loadLabels();
  }, []);

  useEffect(() => {
    if (filterLabelId === null) {
      setFilteredTasks([]);
      return;
    }
    fetch(`/api/tasks?labelId=${filterLabelId}&topLevelOnly=true`)
      .then((res) => res.json())
      .then(setFilteredTasks);
  }, [filterLabelId]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await fetch("/api/labels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), color }),
    });
    setName("");
    await loadLabels();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this label? It will be removed from all tasks.")) return;
    await fetch(`/api/labels/${id}`, { method: "DELETE" });
    if (filterLabelId === id) setFilterLabelId(null);
    await loadLabels();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Create Label</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bug, Feature..."
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label>Color</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {LABEL_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-8 w-8 rounded-full ${color === c ? "ring-2 ring-primary ring-offset-2" : ""}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <Button type="submit">Create label</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Labels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {labels.length === 0 ? (
            <p className="text-sm text-muted-foreground">No labels yet</p>
          ) : (
            labels.map((label) => (
              <div
                key={label.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <button
                  type="button"
                  onClick={() =>
                    setFilterLabelId(filterLabelId === label.id ? null : label.id)
                  }
                  className={`rounded-full px-3 py-1 text-sm font-medium text-white ${
                    filterLabelId === label.id ? "ring-2 ring-primary ring-offset-2" : ""
                  }`}
                  style={{ backgroundColor: label.color }}
                >
                  {label.name}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(label.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {filterLabelId !== null && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Tasks with label: {labels.find((l) => l.id === filterLabelId)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {filteredTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tasks with this label</p>
            ) : (
              filteredTasks.map((task) => (
                <a
                  key={task.id}
                  href={`/projects/${task.projectId}`}
                  className="block rounded-lg border border-border p-3 hover:bg-muted/50"
                >
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.projectName}</p>
                </a>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
