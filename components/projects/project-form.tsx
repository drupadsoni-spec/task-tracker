"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PROJECT_COLORS } from "@/lib/task-constants";

export function ProjectForm({ onCreated }: { onCreated?: () => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(PROJECT_COLORS[0]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), description: description || null, color }),
    });
    setLoading(false);
    if (res.ok) {
      const project = await res.json();
      setName("");
      setDescription("");
      onCreated?.();
      router.push(`/projects/${project.id}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Project name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Work, Personal..."
          className="mt-1"
          required
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
          className="mt-1"
        />
      </div>
      <div>
        <Label>Color</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {PROJECT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`h-8 w-8 rounded-full ${color === c ? "ring-2 ring-primary ring-offset-2" : ""}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create project"}
      </Button>
    </form>
  );
}
