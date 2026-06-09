import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/projects/project-detail";
import { getDb } from "@/lib/db";
import { getProjectById } from "@/lib/services/projects";
import { listTasks } from "@/lib/services/tasks";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function ProjectPage({ params }: PageProps) {
  getDb();
  const { id } = await params;
  const project = getProjectById(Number(id));
  if (!project || project.archived) notFound();

  const tasks = listTasks({ projectId: project.id, topLevelOnly: true });

  return <ProjectDetail project={project} initialTasks={tasks} />;
}
