"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type QuickCaptureProps = {
  inputRef?: React.RefObject<HTMLInputElement | null>;
};

export function QuickCapture({ inputRef }: QuickCaptureProps) {
  const router = useRouter();
  const localRef = useRef<HTMLInputElement>(null);
  const ref = inputRef ?? localRef;
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!title.trim() || loading) return;
    setLoading(true);
    try {
      const inboxRes = await fetch("/api/inbox");
      if (!inboxRes.ok) return;
      const inbox = await inboxRes.json();
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: inbox.id,
          title: title.trim(),
          status: "todo",
        }),
      });
      if (res.ok) {
        setTitle("");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky top-0 z-30 -mx-4 mb-6 border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:-mx-8 lg:px-8"
    >
      <div className="flex gap-2">
        <Input
          ref={ref}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task to Inbox… (press Enter)"
          className="flex-1"
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !title.trim()} size="default">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add task</span>
        </Button>
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">
        Quick capture · <kbd className="rounded bg-muted px-1">/</kbd> to focus ·{" "}
        <kbd className="rounded bg-muted px-1">⌘K</kbd> to search
      </p>
    </form>
  );
}
