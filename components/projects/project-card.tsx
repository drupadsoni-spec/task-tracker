import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectWithCounts } from "@/lib/services/projects";

export function ProjectCard({ project }: { project: ProjectWithCounts }) {
  const progress =
    project.taskCount > 0 ? Math.round((project.doneCount / project.taskCount) * 100) : 0;

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <CardTitle>{project.name}</CardTitle>
          </div>
          {project.description && (
            <p className="text-sm text-muted-foreground">{project.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {project.doneCount}/{project.taskCount} done
            </span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
