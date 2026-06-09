import { addDays, addMonths, addWeeks, format, parseISO } from "date-fns";
import type { RecurrenceRule } from "@/lib/db/schema";

export function parseRecurrenceRule(raw: string | null): RecurrenceRule | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RecurrenceRule;
  } catch {
    return null;
  }
}

export function serializeRecurrenceRule(rule: RecurrenceRule | null): string | null {
  if (!rule) return null;
  return JSON.stringify(rule);
}

function nextWeekday(from: Date, weekdays: number[]): Date {
  const sorted = [...weekdays].sort((a, b) => a - b);
  const currentDay = from.getDay();
  const next = sorted.find((day) => day > currentDay);
  if (next !== undefined) {
    return addDays(from, next - currentDay);
  }
  return addDays(from, 7 - currentDay + sorted[0]);
}

export function computeNextDueDate(
  rule: RecurrenceRule,
  fromDate: string | null
): string {
  const base = fromDate ? parseISO(fromDate) : new Date();
  const interval = Math.max(1, rule.interval);

  let next: Date;
  switch (rule.frequency) {
    case "daily":
      next = addDays(base, interval);
      break;
    case "weekly":
      if (rule.weekdays && rule.weekdays.length > 0) {
        next = nextWeekday(base, rule.weekdays);
      } else {
        next = addWeeks(base, interval);
      }
      break;
    case "monthly":
      next = addMonths(base, interval);
      break;
    default:
      next = addDays(base, 1);
  }

  return format(next, "yyyy-MM-dd");
}
