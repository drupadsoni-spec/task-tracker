"use client";

import { format, parseISO, isPast, isToday } from "date-fns";
import { Calendar, Repeat, ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PRIORITY_COLORS } from "@/lib/task-constants";
import type { TaskWithMeta } from "@/lib/services/tasks";

type TaskCardProps = {
  task: TaskWithMeta;
  onClick?: () => void;
  isDragging?: boolean;
};

export function TaskCard({ task, onClick, isDragging }: TaskCardProps) {
  const dueDateLabel = task.dueDate
    ? format(parseISO(task.dueDate), "MMM d")
    : null;

  const dueOverdue =
    task.dueDate &&
    task.status !== "done" &&
    isPast(parseISO(task.dueDate)) &&
    !isToday(parseISO(task.dueDate));

  const dueToday =
    task.dueDate && task.status !== "done" && isToday(parseISO(task.dueDate));

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border border-border bg-card p-3 text-left shadow-sm transition-shadow hover:shadow-md",
        isDragging && "opacity-50 shadow-lg ring-2 ring-primary/30"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug">{task.title}</p>
        {task.priority !== "none" && (
          <Badge className={cn("shrink-0 capitalize", PRIORITY_COLORS[task.priority])}>
            {task.priority}
          </Badge>
        )}
      </div>

      {task.labels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
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
      )}

      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
        {dueDateLabel && (
          <span
            className={cn(
              "flex items-center gap-1",
              dueOverdue && "text-destructive font-medium",
              dueToday && "text-primary font-medium"
            )}
          >
            <Calendar className="h-3 w-3" />
            {dueDateLabel}
          </span>
        )}
        {task.recurrenceRule && (
          <span className="flex items-center gap-1">
            <Repeat className="h-3 w-3" />
            Recurring
          </span>
        )}
        {task.subtaskCount > 0 && (
          <span className="flex items-center gap-1">
            <ListChecks className="h-3 w-3" />
            {task.subtasksDone}/{task.subtaskCount}
          </span>
        )}
      </div>
    </button>
  );
}
