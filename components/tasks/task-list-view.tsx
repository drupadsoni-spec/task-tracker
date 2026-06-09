"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { TaskPanel } from "@/components/tasks/task-panel";
import { PRIORITY_COLORS, STATUS_COLUMNS } from "@/lib/task-constants";
import { cn } from "@/lib/utils";
import type { TaskWithMeta } from "@/lib/services/tasks";

type TaskListViewProps = {
  projectId: number;
  tasks: TaskWithMeta[];
  onRefresh: () => void;
};

export function TaskListView({ projectId, tasks, onRefresh }: TaskListViewProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const statusLabel = Object.fromEntries(
    STATUS_COLUMNS.map((s) => [s.id, s.label])
  );

  return (
    <>
      <div className="space-y-2 md:hidden">
        {tasks.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">No tasks yet</p>
        )}
        {tasks.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => setSelectedTaskId(task.id)}
            className="w-full rounded-lg border border-border p-3 text-left hover:bg-muted/50"
          >
            <p className="font-medium">{task.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {statusLabel[task.status]}
              {task.dueDate ? ` · ${format(parseISO(task.dueDate), "MMM d")}` : ""}
            </p>
          </button>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-border md:block">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Task</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Priority</th>
              <th className="px-4 py-3 text-left font-medium">Due</th>
              <th className="px-4 py-3 text-left font-medium">Labels</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No tasks yet
                </td>
              </tr>
            )}
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="cursor-pointer border-t border-border hover:bg-muted/30"
                onClick={() => setSelectedTaskId(task.id)}
              >
                <td className="px-4 py-3 font-medium">{task.title}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {statusLabel[task.status]}
                </td>
                <td className="px-4 py-3">
                  {task.priority !== "none" && (
                    <Badge className={cn("capitalize", PRIORITY_COLORS[task.priority])}>
                      {task.priority}
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {task.dueDate ? format(parseISO(task.dueDate), "MMM d, yyyy") : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {task.labels.map((label) => (
                      <span
                        key={label.id}
                        className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                        style={{ backgroundColor: label.color }}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTaskId !== null && (
        <TaskPanel
          taskId={selectedTaskId}
          projectId={projectId}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={onRefresh}
        />
      )}
    </>
  );
}
