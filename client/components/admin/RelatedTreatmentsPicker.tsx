"use client";

import { Check } from "lucide-react";
import type { AdminTreatment } from "@/types/admin";

interface RelatedTreatmentsPickerProps {
  options: AdminTreatment[];
  selectedIds: string[];
  excludeId?: string;
  onChange: (ids: string[]) => void;
}

export function RelatedTreatmentsPicker({
  options,
  selectedIds,
  excludeId,
  onChange,
}: RelatedTreatmentsPickerProps) {
  const choices = options.filter((option) => option._id !== excludeId);

  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  if (choices.length === 0) {
    return <p className="text-sm text-ink-700">No other treatments exist yet to relate to.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {choices.map((option) => {
        const isSelected = selectedIds.includes(option._id);
        return (
          <button
            key={option._id}
            type="button"
            onClick={() => toggle(option._id)}
            aria-pressed={isSelected}
            className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors ${
              isSelected
                ? "border-primary-600 bg-primary-50 text-primary-800"
                : "border-black/10 text-ink-900 hover:border-primary-300"
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                isSelected ? "border-primary-600 bg-primary-700 text-white" : "border-black/20"
              }`}
            >
              {isSelected && <Check size={13} />}
            </span>
            <span className="truncate">{option.name}</span>
          </button>
        );
      })}
    </div>
  );
}
