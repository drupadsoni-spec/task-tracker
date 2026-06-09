"use client";

import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { CalendarCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { TaskRow } from "@/components/tasks/task-row";
import type { TaskWithMeta } from "@/lib/services/tasks";

type TodayViewProps = {
  todayTasks: TaskWithMeta[];
  overdueTasks: TaskWithMeta[];
};

export function TodayView({ todayTasks, overdueTasks }: TodayViewProps) {
  const router = useRouter();

  async function completeTask(id: number) {
    await fetch(`/api/tasks/${id}/complete`, { method: "POST" });
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Today</h1>
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Due Today ({todayTasks.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {todayTasks.length === 0 ? (
            <EmptyState
              icon={CalendarCheck}
              title="Nothing due today"
              description="Capture a task with the bar above, or schedule something for later."
              actionLabel="View upcoming"
              actionHref="/upcoming"
            />
          ) : (
            todayTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                href={`/projects/${task.projectId}?task=${task.id}`}
                onComplete={completeTask}
                subtitle={
                  <p className="text-xs text-muted-foreground">{task.projectName}</p>
                }
              />
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Overdue ({overdueTasks.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {overdueTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No overdue tasks — you&apos;re on track.</p>
          ) : (
            overdueTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                href={`/projects/${task.projectId}?task=${task.id}`}
                onComplete={completeTask}
                subtitle={
                  <p className="text-xs text-destructive">
                    Due {task.dueDate ? format(parseISO(task.dueDate), "MMM d, yyyy") : ""} ·{" "}
                    {task.projectName}
                  </p>
                }
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
