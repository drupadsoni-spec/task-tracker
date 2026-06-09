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
      <div className="overflow-hidden rounded-xl border border-border">
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
