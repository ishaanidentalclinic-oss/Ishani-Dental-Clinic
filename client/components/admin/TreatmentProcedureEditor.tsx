"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { TreatmentProcedureStep } from "@/types/admin";

interface TreatmentProcedureEditorProps {
  steps: TreatmentProcedureStep[];
  onChange: (steps: TreatmentProcedureStep[]) => void;
}

export function TreatmentProcedureEditor({ steps, onChange }: TreatmentProcedureEditorProps) {
  function updateStep(index: number, patch: Partial<TreatmentProcedureStep>) {
    onChange(steps.map((step, i) => (i === index ? { ...step, ...patch } : step)));
  }

  function addStep() {
    onChange([...steps, { title: "", description: "" }]);
  }

  function removeStep(index: number) {
    onChange(steps.filter((_, i) => i !== index));
  }

  function moveStep(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= steps.length) return;
    const next = [...steps];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="rounded-xl border border-black/10 bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold tracking-wide text-ink-700 uppercase">
              Step {index + 1}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveStep(index, -1)}
                disabled={index === 0}
                aria-label="Move step up"
                title="Move up"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-700 hover:bg-black/5 disabled:pointer-events-none disabled:opacity-30 sm:h-7 sm:w-7"
              >
                <ChevronUp size={15} />
              </button>
              <button
                type="button"
                onClick={() => moveStep(index, 1)}
                disabled={index === steps.length - 1}
                aria-label="Move step down"
                title="Move down"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-700 hover:bg-black/5 disabled:pointer-events-none disabled:opacity-30 sm:h-7 sm:w-7"
              >
                <ChevronDown size={15} />
              </button>
              <button
                type="button"
                onClick={() => removeStep(index)}
                aria-label="Remove step"
                title="Remove step"
                className="flex h-9 w-9 items-center justify-center rounded-full text-red-600 hover:bg-red-50 sm:h-7 sm:w-7"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          <div className="mt-3 space-y-3">
            <Input
              value={step.title}
              onChange={(event) => updateStep(index, { title: event.target.value })}
              placeholder="Step title"
            />
            <Textarea
              rows={2}
              value={step.description}
              onChange={(event) => updateStep(index, { description: event.target.value })}
              placeholder="Step description"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addStep}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 py-3 text-sm font-medium text-ink-700 transition-colors hover:border-primary-300 hover:text-primary-700"
      >
        <Plus size={16} />
        Add step
      </button>
    </div>
  );
}
