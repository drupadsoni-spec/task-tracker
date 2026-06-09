"use client";

import { useCallback, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { TaskListView } from "@/components/tasks/task-list-view";
import type { Project } from "@/lib/db/schema";
import type { TaskWithMeta } from "@/lib/services/tasks";

type ProjectDetailProps = {
  project: Project;
  initialTasks: TaskWithMeta[];
};

export function ProjectDetail({ project, initialTasks }: ProjectDetailProps) {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [tasks, setTasks] = useState(initialTasks);

  const refreshTasks = useCallback(async () => {
    const res = await fetch(`/api/tasks?projectId=${project.id}&topLevelOnly=true`);
    if (res.ok) setTasks(await res.json());
  }, [project.id]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
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
        <div className="flex rounded-lg border border-border p-1">
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
        <KanbanBoard projectId={project.id} initialTasks={tasks} />
      ) : (
        <TaskListView projectId={project.id} tasks={tasks} onRefresh={refreshTasks} />
      )}
    </div>
  );
}
