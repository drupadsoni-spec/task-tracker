"use client";

import { useEffect, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TaskWithMeta } from "@/lib/services/tasks";

type SubtaskListProps = {
  parentTaskId: number;
  projectId: number;
  onUpdate?: () => void;
};

export function SubtaskList({ parentTaskId, projectId, onUpdate }: SubtaskListProps) {
  const [subtasks, setSubtasks] = useState<TaskWithMeta[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadSubtasks() {
    const res = await fetch(`/api/tasks?parentTaskId=${parentTaskId}&topLevelOnly=false`);
    if (res.ok) setSubtasks(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    loadSubtasks();
  }, [parentTaskId]);

  async function addSubtask() {
    if (!newTitle.trim()) return;
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        parentTaskId,
        title: newTitle.trim(),
        status: "todo",
      }),
    });
    setNewTitle("");
    await loadSubtasks();
    onUpdate?.();
  }

  async function toggleSubtask(id: number, done: boolean) {
    if (done) {
      await fetch(`/api/tasks/${id}/complete`, { method: "POST" });
    } else {
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "todo", completedAt: null }),
      });
    }
    await loadSubtasks();
    onUpdate?.();
  }

  async function deleteSubtask(id: number) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    await loadSubtasks();
    onUpdate?.();
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading subtasks...</p>;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Subtasks</p>
      {subtasks.map((subtask) => (
        <div key={subtask.id} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleSubtask(subtask.id, subtask.status !== "done")}
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
              subtask.status === "done"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border"
            }`}
          >
            {subtask.status === "done" && <Check className="h-3 w-3" />}
          </button>
          <span
            className={`flex-1 text-sm ${
              subtask.status === "done" ? "text-muted-foreground line-through" : ""
            }`}
          >
            {subtask.title}
          </span>
          <button
            type="button"
            onClick={() => deleteSubtask(subtask.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <Input
          placeholder="Add subtask..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addSubtask()}
        />
        <Button size="sm" variant="outline" onClick={addSubtask}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
