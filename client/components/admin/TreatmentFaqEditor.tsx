"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { TreatmentFaq } from "@/types/admin";

interface TreatmentFaqEditorProps {
  faqs: TreatmentFaq[];
  onChange: (faqs: TreatmentFaq[]) => void;
}

export function TreatmentFaqEditor({ faqs, onChange }: TreatmentFaqEditorProps) {
  function updateFaq(index: number, patch: Partial<TreatmentFaq>) {
    onChange(faqs.map((faq, i) => (i === index ? { ...faq, ...patch } : faq)));
  }

  function addFaq() {
    onChange([...faqs, { question: "", answer: "" }]);
  }

  function removeFaq(index: number) {
    onChange(faqs.filter((_, i) => i !== index));
  }

  function moveFaq(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= faqs.length) return;
    const next = [...faqs];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="rounded-xl border border-black/10 bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold tracking-wide text-ink-700 uppercase">
              FAQ {index + 1}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveFaq(index, -1)}
                disabled={index === 0}
                aria-label="Move FAQ up"
                title="Move up"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-700 hover:bg-black/5 disabled:pointer-events-none disabled:opacity-30 sm:h-7 sm:w-7"
              >
                <ChevronUp size={15} />
              </button>
              <button
                type="button"
                onClick={() => moveFaq(index, 1)}
                disabled={index === faqs.length - 1}
                aria-label="Move FAQ down"
                title="Move down"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-700 hover:bg-black/5 disabled:pointer-events-none disabled:opacity-30 sm:h-7 sm:w-7"
              >
                <ChevronDown size={15} />
              </button>
              <button
                type="button"
                onClick={() => removeFaq(index)}
                aria-label="Remove FAQ"
                title="Remove FAQ"
                className="flex h-9 w-9 items-center justify-center rounded-full text-red-600 hover:bg-red-50 sm:h-7 sm:w-7"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          <div className="mt-3 space-y-3">
            <Input
              value={faq.question}
              onChange={(event) => updateFaq(index, { question: event.target.value })}
              placeholder="Question"
            />
            <Textarea
              rows={2}
              value={faq.answer}
              onChange={(event) => updateFaq(index, { answer: event.target.value })}
              placeholder="Answer"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addFaq}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 py-3 text-sm font-medium text-ink-700 transition-colors hover:border-primary-300 hover:text-primary-700"
      >
        <Plus size={16} />
        Add FAQ
      </button>
    </div>
  );
}
