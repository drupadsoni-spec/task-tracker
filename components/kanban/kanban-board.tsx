"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KanbanColumn } from "@/components/kanban/kanban-column";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskPanel } from "@/components/tasks/task-panel";
import { STATUS_COLUMNS } from "@/lib/task-constants";
import type { TaskWithMeta } from "@/lib/services/tasks";
import type { TaskStatus } from "@/lib/db/schema";

type KanbanBoardProps = {
  projectId: number;
  initialTasks: TaskWithMeta[];
  externalSelectedTaskId?: number | null;
  onExternalTaskClose?: () => void;
};

export function KanbanBoard({
  projectId,
  initialTasks,
  externalSelectedTaskId,
  onExternalTaskClose,
}: KanbanBoardProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState<TaskWithMeta | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [addingToColumn, setAddingToColumn] = useState<TaskStatus | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const refreshTasks = useCallback(async () => {
    const res = await fetch(`/api/tasks?projectId=${projectId}&topLevelOnly=true`);
    if (res.ok) setTasks(await res.json());
  }, [projectId]);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  useEffect(() => {
    if (externalSelectedTaskId) setSelectedTaskId(externalSelectedTaskId);
  }, [externalSelectedTaskId]);

  const tasksByStatus = STATUS_COLUMNS.reduce(
    (acc, col) => {
      acc[col.id] = tasks
        .filter((t) => t.status === col.id)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      return acc;
    },
    {} as Record<TaskStatus, TaskWithMeta[]>
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const taskId = Number(active.id);
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const overId = String(over.id);
    let newStatus: TaskStatus = task.status;
    let newSortOrder = task.sortOrder;

    if (STATUS_COLUMNS.some((c) => c.id === overId)) {
      newStatus = overId as TaskStatus;
      newSortOrder = (tasksByStatus[newStatus]?.length ?? 0);
    } else {
      const overTask = tasks.find((t) => t.id === Number(overId));
      if (overTask) {
        newStatus = overTask.status;
        newSortOrder = overTask.sortOrder;
      }
    }

    if (newStatus === task.status && newSortOrder === task.sortOrder) return;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus, sortOrder: newSortOrder } : t
      )
    );

    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, sortOrder: newSortOrder }),
    });
  }

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === Number(event.active.id));
    if (task) setActiveTask(task);
  }

  async function handleQuickAdd(status: TaskStatus) {
    if (!newTitle.trim()) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        title: newTitle.trim(),
        status,
      }),
    });
    if (res.ok) {
      setNewTitle("");
      setAddingToColumn(null);
      await refreshTasks();
    }
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUS_COLUMNS.map((column) => (
            <KanbanColumn key={column.id} id={column.id} title={column.label}>
              <SortableContext
                items={tasksByStatus[column.id].map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-2">
                  {tasksByStatus[column.id].map((task) => (
                    <KanbanColumn.SortableTask
                      key={task.id}
                      task={task}
                      onClick={() => setSelectedTaskId(task.id)}
                    />
                  ))}
                </div>
              </SortableContext>

              {addingToColumn === column.id ? (
                <div className="mt-2 space-y-2">
                  <Input
                    autoFocus
                    placeholder="Task title..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleQuickAdd(column.id);
                      if (e.key === "Escape") setAddingToColumn(null);
                    }}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleQuickAdd(column.id)}>
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setAddingToColumn(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full justify-start text-muted-foreground"
                  onClick={() => {
                    setAddingToColumn(column.id);
                    setNewTitle("");
                  }}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add task
                </Button>
              )}
            </KanbanColumn>
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>

      {selectedTaskId !== null && (
        <TaskPanel
          taskId={selectedTaskId}
          projectId={projectId}
          onClose={() => {
            setSelectedTaskId(null);
            onExternalTaskClose?.();
          }}
          onUpdate={refreshTasks}
        />
      )}
    </>
  );
}
