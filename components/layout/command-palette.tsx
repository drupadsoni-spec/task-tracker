"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { TaskWithMeta } from "@/lib/services/tasks";

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
};

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TaskWithMeta[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/tasks?q=${encodeURIComponent(q)}&topLevelOnly=true`);
    if (res.ok) setResults(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      return;
    }
    const timer = setTimeout(() => search(query), 200);
    return () => clearTimeout(timer);
  }, [query, open, search]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function openTask(task: TaskWithMeta) {
    onClose();
    router.push(`/projects/${task.projectId}?task=${task.id}`);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 px-4 pt-[15vh]" onClick={onClose}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks…"
            className="border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {loading && <p className="px-3 py-2 text-sm text-muted-foreground">Searching…</p>}
          {!loading && query && results.length === 0 && (
            <p className="px-3 py-2 text-sm text-muted-foreground">No tasks found</p>
          )}
          {!query && (
            <p className="px-3 py-2 text-sm text-muted-foreground">Type to search tasks by title or description</p>
          )}
          {results.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => openTask(task)}
              className="flex w-full flex-col rounded-lg px-3 py-2 text-left hover:bg-muted"
            >
              <span className="text-sm font-medium">{task.title}</span>
              <span className="text-xs text-muted-foreground">{task.projectName}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
