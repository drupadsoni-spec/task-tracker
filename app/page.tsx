import Link from "next/link";
import { format, parseISO } from "date-fns";
import { AlertCircle, CalendarDays, FolderKanban, ListTodo } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDb } from "@/lib/db";
import { getDashboardStats } from "@/lib/services/dashboard";
import { PRIORITY_COLORS } from "@/lib/task-constants";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  getDb();
  const stats = getDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your tasks and projects</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Due Today</CardTitle>
            <CalendarDays className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.todayCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">{stats.overdueCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            <ListTodo className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.inProgressCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.projectCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Due Today</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.todayTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tasks due today</p>
            ) : (
              stats.todayTasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/projects/${task.projectId}?task=${task.id}`}
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
            <CardTitle>Overdue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.overdueTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No overdue tasks</p>
            ) : (
              stats.overdueTasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/projects/${task.projectId}?task=${task.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-destructive">
                      Due {task.dueDate ? format(parseISO(task.dueDate), "MMM d") : ""}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {stats.recentTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Updated</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.recentTasks.map((task) => (
              <Link
                key={task.id}
                href={`/projects/${task.projectId}?task=${task.id}`}
                className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.projectName}</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stats.activeProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50"
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {project.doneCount}/{project.taskCount} done
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
