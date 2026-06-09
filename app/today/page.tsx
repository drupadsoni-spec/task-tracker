import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDb } from "@/lib/db";
import { listTasks } from "@/lib/services/tasks";
import { PRIORITY_COLORS } from "@/lib/task-constants";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function TodayPage() {
  getDb();
  const todayTasks = listTasks({ due: "today", topLevelOnly: true });
  const overdueTasks = listTasks({ due: "overdue", topLevelOnly: true });

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
            <p className="text-sm text-muted-foreground">Nothing due today — enjoy your day!</p>
          ) : (
            todayTasks.map((task) => (
              <Link
                key={task.id}
                href={`/projects/${task.projectId}`}
                className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.projectName}</p>
                </div>
                {task.priority !== "none" && (
                  <Badge className={cn("capitalize", PRIORITY_COLORS[task.priority])}>
                    {task.priority}
                  </Badge>
                )}
              </Link>
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
            <p className="text-sm text-muted-foreground">No overdue tasks</p>
          ) : (
            overdueTasks.map((task) => (
              <Link
                key={task.id}
                href={`/projects/${task.projectId}`}
                className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-destructive">
                    Due {task.dueDate ? format(parseISO(task.dueDate), "MMM d, yyyy") : ""} ·{" "}
                    {task.projectName}
                  </p>
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
