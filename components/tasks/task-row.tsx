"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PRIORITY_COLORS } from "@/lib/task-constants";
import { cn } from "@/lib/utils";
import type { TaskWithMeta } from "@/lib/services/tasks";

type TaskRowProps = {
  task: TaskWithMeta;
  subtitle?: React.ReactNode;
  onComplete?: (id: number) => void;
  href?: string;
};

export function TaskRow({ task, subtitle, onComplete, href }: TaskRowProps) {
  const content = (
    <>
      {onComplete && task.status !== "done" && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onComplete(task.id);
          }}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border hover:border-primary hover:bg-primary/5"
          aria-label="Complete task"
        >
          <Check className="h-3 w-3 opacity-0 hover:opacity-100" />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{task.title}</p>
        {subtitle}
      </div>
      {task.priority !== "none" && (
        <Badge className={cn("shrink-0 capitalize", PRIORITY_COLORS[task.priority])}>
          {task.priority}
        </Badge>
      )}
    </>
  );

  const className =
    "flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50";

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
