"use client";

import { useEffect, useState } from "react";
import { X, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { SubtaskList } from "@/components/tasks/subtask-list";
import { RecurrencePicker } from "@/components/tasks/recurrence-picker";
import { PRIORITY_OPTIONS, STATUS_COLUMNS } from "@/lib/task-constants";
import { parseRecurrenceRule } from "@/lib/services/recurrence";
import type { Label as LabelType, RecurrenceRule } from "@/lib/db/schema";
import type { TaskWithMeta } from "@/lib/services/tasks";

type TaskPanelProps = {
  taskId: number;
  projectId: number;
  onClose: () => void;
  onUpdate: () => void;
};

export function TaskPanel({ taskId, projectId, onClose, onUpdate }: TaskPanelProps) {
  const [task, setTask] = useState<TaskWithMeta | null>(null);
  const [labels, setLabels] = useState<LabelType[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(task?.status ?? "todo");
  const [priority, setPriority] = useState(task?.priority ?? "none");
  const [dueDate, setDueDate] = useState("");
  const [selectedLabelIds, setSelectedLabelIds] = useState<number[]>([]);
  const [recurrence, setRecurrence] = useState<RecurrenceRule | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadTask() {
    const [taskRes, labelsRes] = await Promise.all([
      fetch(`/api/tasks/${taskId}`),
      fetch("/api/labels"),
    ]);
    if (taskRes.ok) {
      const data: TaskWithMeta = await taskRes.json();
      setTask(data);
      setTitle(data.title);
      setDescription(data.description ?? "");
      setStatus(data.status);
      setPriority(data.priority);
      setDueDate(data.dueDate ?? "");
      setSelectedLabelIds(data.labels.map((l) => l.id));
      setRecurrence(parseRecurrenceRule(data.recurrenceRule));
    }
    if (labelsRes.ok) setLabels(await labelsRes.json());
  }

  useEffect(() => {
    loadTask();
  }, [taskId]);

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: description || null,
        status,
        priority,
        dueDate: dueDate || null,
        labelIds: selectedLabelIds,
        recurrenceRule: recurrence,
      }),
    });
    setSaving(false);
    onUpdate();
    await loadTask();
  }

  async function handleComplete() {
    await fetch(`/api/tasks/${taskId}/complete`, { method: "POST" });
    onUpdate();
    onClose();
  }

  async function handleDelete() {
    if (!confirm("Delete this task and its subtasks?")) return;
    await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    onUpdate();
    onClose();
  }

  function toggleLabel(labelId: number) {
    setSelectedLabelIds((prev) =>
      prev.includes(labelId) ? prev.filter((id) => id !== labelId) : [...prev, labelId]
    );
  }

  if (!task) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
        <div className="h-full w-full max-w-lg bg-card p-6 shadow-xl">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold">Edit Task</h2>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-4 p-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Status</Label>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="mt-1"
              >
                {STATUS_COLUMNS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value as typeof priority)}
                className="mt-1"
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label>Due date</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Labels</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {labels.map((label) => (
                <button
                  key={label.id}
                  type="button"
                  onClick={() => toggleLabel(label.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium text-white transition-opacity ${
                    selectedLabelIds.includes(label.id)
                      ? "opacity-100 ring-2 ring-primary ring-offset-1"
                      : "opacity-50"
                  }`}
                  style={{ backgroundColor: label.color }}
                >
                  {label.name}
                </button>
              ))}
              {labels.length === 0 && (
                <p className="text-sm text-muted-foreground">No labels yet. Create some on the Labels page.</p>
              )}
            </div>
          </div>

          <RecurrencePicker value={recurrence} onChange={setRecurrence} />

          <SubtaskList parentTaskId={taskId} projectId={projectId} onUpdate={onUpdate} />
        </div>

        <div className="flex items-center justify-between border-t border-border p-4">
          <div className="flex gap-2">
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="mr-1 h-4 w-4" />
              Delete
            </Button>
            {status !== "done" && (
              <Button variant="outline" size="sm" onClick={handleComplete}>
                <CheckCircle2 className="mr-1 h-4 w-4" />
                Complete
              </Button>
            )}
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
