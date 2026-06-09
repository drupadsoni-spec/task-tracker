"use client";

import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { RecurrenceRule } from "@/lib/db/schema";

const WEEKDAYS = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

type RecurrencePickerProps = {
  value: RecurrenceRule | null;
  onChange: (value: RecurrenceRule | null) => void;
};

export function RecurrencePicker({ value, onChange }: RecurrencePickerProps) {
  const enabled = value !== null;

  function toggle(enabled: boolean) {
    if (!enabled) {
      onChange(null);
    } else {
      onChange({ frequency: "weekly", interval: 1, weekdays: [1] });
    }
  }

  function update(partial: Partial<RecurrenceRule>) {
    if (!value) return;
    onChange({ ...value, ...partial });
  }

  function toggleWeekday(day: number) {
    if (!value) return;
    const weekdays = value.weekdays ?? [];
    const next = weekdays.includes(day)
      ? weekdays.filter((d) => d !== day)
      : [...weekdays, day].sort();
    update({ weekdays: next });
  }

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => toggle(e.target.checked)}
          className="rounded border-border"
        />
        <span className="font-medium">Recurring task</span>
      </label>

      {enabled && value && (
        <div className="space-y-3 rounded-lg border border-border p-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Frequency</Label>
              <Select
                value={value.frequency}
                onChange={(e) =>
                  update({ frequency: e.target.value as RecurrenceRule["frequency"] })
                }
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </Select>
            </div>
            <div>
              <Label>Every</Label>
              <Input
                type="number"
                min={1}
                value={value.interval}
                onChange={(e) => update({ interval: Number(e.target.value) || 1 })}
              />
            </div>
          </div>

          {value.frequency === "weekly" && (
            <div>
              <Label>On days</Label>
              <div className="mt-2 flex flex-wrap gap-1">
                {WEEKDAYS.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleWeekday(day.value)}
                    className={`rounded-md px-2 py-1 text-xs font-medium ${
                      (value.weekdays ?? []).includes(day.value)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
