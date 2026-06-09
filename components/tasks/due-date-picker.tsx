"use client";

import { Input } from "@/components/ui/input";
import { getDuePresets } from "@/lib/due-date-presets";
import { cn } from "@/lib/utils";

type DueDatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function DueDatePicker({ value, onChange, className }: DueDatePickerProps) {
  const presets = getDuePresets();

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.value ?? "")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              (preset.value ?? "") === value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <Input type="date" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
