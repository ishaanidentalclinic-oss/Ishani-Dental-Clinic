"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface StringListEditorProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}

/** Reorderable list of plain-text items — shared by Benefits and Ideal For. */
export function StringListEditor({
  items,
  onChange,
  placeholder = "",
  addLabel = "Add item",
}: StringListEditorProps) {
  function updateItem(index: number, value: string) {
    onChange(items.map((item, i) => (i === index ? value : item)));
  }

  function addItem() {
    onChange([...items, ""]);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function moveItem(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={item}
            onChange={(event) => updateItem(index, event.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => moveItem(index, -1)}
              disabled={index === 0}
              aria-label="Move up"
              title="Move up"
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink-700 hover:bg-black/5 disabled:pointer-events-none disabled:opacity-30 sm:h-8 sm:w-8"
            >
              <ChevronUp size={15} />
            </button>
            <button
              type="button"
              onClick={() => moveItem(index, 1)}
              disabled={index === items.length - 1}
              aria-label="Move down"
              title="Move down"
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink-700 hover:bg-black/5 disabled:pointer-events-none disabled:opacity-30 sm:h-8 sm:w-8"
            >
              <ChevronDown size={15} />
            </button>
            <button
              type="button"
              onClick={() => removeItem(index)}
              aria-label="Remove item"
              title="Remove"
              className="flex h-10 w-10 items-center justify-center rounded-full text-red-600 hover:bg-red-50 sm:h-8 sm:w-8"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:border-primary-300 hover:text-primary-700"
      >
        <Plus size={16} />
        {addLabel}
      </button>
    </div>
  );
}
