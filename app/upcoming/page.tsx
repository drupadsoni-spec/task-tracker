import { format, parseISO } from "date-fns";
import { CalendarRange } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { TaskRow } from "@/components/tasks/task-row";
import { getDb } from "@/lib/db";
import { listTasks } from "@/lib/services/tasks";

export const dynamic = "force-dynamic";

export default function UpcomingPage() {
  getDb();
  const upcomingTasks = listTasks({ due: "upcoming", topLevelOnly: true });

  const byDate = upcomingTasks.reduce(
    (acc, task) => {
      const key = task.dueDate ?? "No date";
      if (!acc[key]) acc[key] = [];
      acc[key].push(task);
      return acc;
    },
    {} as Record<string, typeof upcomingTasks>
  );

  const sortedDates = Object.keys(byDate).sort();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Upcoming</h1>
        <p className="text-muted-foreground">Tasks due in the next 7 days</p>
      </div>

      {sortedDates.length === 0 ? (
        <EmptyState
          icon={CalendarRange}
          title="Nothing scheduled"
          description="Add due dates to tasks to see them here — try Today, Tomorrow, or Next week presets."
          actionLabel="Go to Inbox"
          actionHref="/inbox"
        />
      ) : (
        sortedDates.map((date) => (
          <Card key={date}>
            <CardHeader>
              <CardTitle>
                {format(parseISO(date), "EEEE, MMMM d")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {byDate[date].map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  href={`/projects/${task.projectId}?task=${task.id}`}
                  subtitle={
                    <p className="text-xs text-muted-foreground">{task.projectName}</p>
                  }
                />
              ))}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
