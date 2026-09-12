"use client";

import { Input } from "@/components/ui/Input";
import type { SchedulingHours, DayHours } from "@/types/admin";

const DAY_LABELS: { key: keyof SchedulingHours; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

interface BusinessHoursEditorProps {
  value: SchedulingHours;
  onChange: (value: SchedulingHours) => void;
}

/** Structured, per-day open/close hours used by appointment scheduling
 * (slot generation + business-hours validation) — distinct from the
 * free-text "Business hours" display string shown on the public site. */
export function BusinessHoursEditor({ value, onChange }: BusinessHoursEditorProps) {
  function updateDay(day: keyof SchedulingHours, patch: Partial<DayHours>) {
    onChange({ ...value, [day]: { ...value[day], ...patch } });
  }

  return (
    <div className="space-y-2">
      {DAY_LABELS.map(({ key, label }) => {
        const day = value[key];
        return (
          <div
            key={key}
            className="flex flex-col gap-3 rounded-lg border border-black/10 px-3.5 py-2.5 sm:grid sm:grid-cols-[120px_auto_1fr_1fr] sm:items-center"
          >
            <div className="flex items-center justify-between sm:contents">
              <span className="text-sm font-medium text-ink-900">{label}</span>

              <label className="flex items-center gap-2 text-xs text-ink-700">
                <input
                  type="checkbox"
                  checked={day.isOpen}
                  onChange={(event) => updateDay(key, { isOpen: event.target.checked })}
                  className="h-4 w-4 rounded border-black/20 text-primary-700 focus:ring-primary-600/30"
                />
                Open
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:contents">
              <Input
                type="time"
                value={day.openTime}
                disabled={!day.isOpen}
                onChange={(event) => updateDay(key, { openTime: event.target.value })}
                className="disabled:opacity-40"
              />
              <Input
                type="time"
                value={day.closeTime}
                disabled={!day.isOpen}
                onChange={(event) => updateDay(key, { closeTime: event.target.value })}
                className="disabled:opacity-40"
              />
            </div>
          </div>
        );
      })}
      <p className="text-xs text-ink-700">
        These hours control which appointment times patients can actually book — the free-text
        &quot;Business hours&quot; field above is just what&apos;s displayed on the site.
      </p>
    </div>
  );
}
