import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectForm } from "@/components/projects/project-form";
import { getDb } from "@/lib/db";
import { listProjects } from "@/lib/services/projects";

export const dynamic = "force-dynamic";

export default function ProjectsPage() {
  getDb();
  const projects = listProjects();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="text-muted-foreground">Organize tasks into projects</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
