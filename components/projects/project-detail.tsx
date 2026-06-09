"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { TaskListView } from "@/components/tasks/task-list-view";
import { TaskPanel } from "@/components/tasks/task-panel";
import type { Project } from "@/lib/db/schema";
import type { TaskWithMeta } from "@/lib/services/tasks";

type ProjectDetailProps = {
  project: Project;
  initialTasks: TaskWithMeta[];
};

export function ProjectDetail({ project, initialTasks }: ProjectDetailProps) {
  const searchParams = useSearchParams();
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const refreshTasks = useCallback(async () => {
    const res = await fetch(`/api/tasks?projectId=${project.id}&topLevelOnly=true`);
    if (res.ok) setTasks(await res.json());
  }, [project.id]);

  useEffect(() => {
    const taskParam = searchParams.get("task");
    if (taskParam) setSelectedTaskId(Number(taskParam));
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            {project.description && (
              <p className="text-muted-foreground">{project.description}</p>
            )}
          </div>
        </div>
        <div className="flex rounded-lg border border-border p-1 self-start">
          <Button
            variant={view === "kanban" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("kanban")}
          >
            <LayoutGrid className="mr-1 h-4 w-4" />
            Board
          </Button>
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("list")}
          >
            <List className="mr-1 h-4 w-4" />
            List
          </Button>
        </div>
      </div>

      {view === "kanban" ? (
        <KanbanBoard
          projectId={project.id}
          initialTasks={tasks}
          externalSelectedTaskId={selectedTaskId}
          onExternalTaskClose={() => setSelectedTaskId(null)}
        />
      ) : (
        <TaskListView projectId={project.id} tasks={tasks} onRefresh={refreshTasks} />
      )}

      {selectedTaskId !== null && view === "list" && (
        <TaskPanel
          taskId={selectedTaskId}
          projectId={project.id}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={refreshTasks}
        />
      )}
    </div>
  );
}
