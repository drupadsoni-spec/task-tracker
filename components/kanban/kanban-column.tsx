"use client";

import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard } from "@/components/tasks/task-card";
import { cn } from "@/lib/utils";
import type { TaskWithMeta } from "@/lib/services/tasks";
import type { TaskStatus } from "@/lib/db/schema";

type KanbanColumnProps = {
  id: TaskStatus;
  title: string;
  children: React.ReactNode;
};

function SortableTask({
  task,
  onClick,
}: {
  task: TaskWithMeta;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onClick={onClick} isDragging={isDragging} />
    </div>
  );
}

export function KanbanColumn({ id, title, children }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-72 shrink-0 flex-col rounded-xl bg-muted/50 p-3",
        isOver && "ring-2 ring-primary/30"
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

KanbanColumn.SortableTask = SortableTask;
