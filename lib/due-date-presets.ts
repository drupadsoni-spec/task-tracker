import { addDays, addWeeks, format, nextMonday, startOfToday } from "date-fns";

export type DuePreset = {
  id: string;
  label: string;
  value: string | null;
};

export function getDuePresets(): DuePreset[] {
  const today = startOfToday();
  return [
    { id: "none", label: "No date", value: null },
    { id: "today", label: "Today", value: format(today, "yyyy-MM-dd") },
    { id: "tomorrow", label: "Tomorrow", value: format(addDays(today, 1), "yyyy-MM-dd") },
    {
      id: "next-week",
      label: "Next week",
      value: format(nextMonday(addDays(today, 1)), "yyyy-MM-dd"),
    },
    { id: "in-week", label: "In 1 week", value: format(addWeeks(today, 1), "yyyy-MM-dd") },
  ];
}

export function presetLabelForDate(date: string | null): string | null {
  if (!date) return null;
  const preset = getDuePresets().find((p) => p.value === date);
  return preset?.label ?? null;
}
