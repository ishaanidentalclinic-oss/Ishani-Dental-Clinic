"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { BlogSection } from "@/types/admin";

interface BlogSectionsEditorProps {
  sections: BlogSection[];
  onChange: (sections: BlogSection[]) => void;
}

function linesToArray(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function BlogSectionsEditor({ sections, onChange }: BlogSectionsEditorProps) {
  function updateSection(index: number, patch: Partial<BlogSection>) {
    onChange(sections.map((section, i) => (i === index ? { ...section, ...patch } : section)));
  }

  function addSection() {
    onChange([...sections, { heading: "", paragraphs: [], bullets: [] }]);
  }

  function removeSection(index: number) {
    onChange(sections.filter((_, i) => i !== index));
  }

  function moveSection(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <div key={index} className="rounded-xl border border-black/10 bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold tracking-wide text-ink-700 uppercase">
              Section {index + 1}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveSection(index, -1)}
                disabled={index === 0}
                aria-label="Move section up"
                title="Move up"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-700 hover:bg-black/5 disabled:pointer-events-none disabled:opacity-30 sm:h-7 sm:w-7"
              >
                <ChevronUp size={15} />
              </button>
              <button
                type="button"
                onClick={() => moveSection(index, 1)}
                disabled={index === sections.length - 1}
                aria-label="Move section down"
                title="Move down"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-700 hover:bg-black/5 disabled:pointer-events-none disabled:opacity-30 sm:h-7 sm:w-7"
              >
                <ChevronDown size={15} />
              </button>
              <button
                type="button"
                onClick={() => removeSection(index)}
                aria-label="Remove section"
                title="Remove section"
                className="flex h-9 w-9 items-center justify-center rounded-full text-red-600 hover:bg-red-50 sm:h-7 sm:w-7"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          <div className="mt-3 space-y-3">
            <Input
              value={section.heading ?? ""}
              onChange={(event) => updateSection(index, { heading: event.target.value })}
              placeholder="Section heading (optional)"
            />
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-700">
                Paragraphs (one per line)
              </label>
              <Textarea
                rows={4}
                value={(section.paragraphs ?? []).join("\n")}
                onChange={(event) =>
                  updateSection(index, { paragraphs: linesToArray(event.target.value) })
                }
                placeholder="Write each paragraph on its own line..."
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-700">
                Bullet points (one per line)
              </label>
              <Textarea
                rows={3}
                value={(section.bullets ?? []).join("\n")}
                onChange={(event) =>
                  updateSection(index, { bullets: linesToArray(event.target.value) })
                }
                placeholder="Optional — write each bullet on its own line..."
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addSection}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 py-3 text-sm font-medium text-ink-700 transition-colors hover:border-primary-300 hover:text-primary-700"
      >
        <Plus size={16} />
        Add section
      </button>
    </div>
  );
}
