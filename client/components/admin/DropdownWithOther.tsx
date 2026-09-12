"use client";

import { useState } from "react";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";

const OTHER_VALUE = "__other__";

interface DropdownWithOtherProps {
  id?: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  otherPlaceholder?: string;
}

/**
 * A <select> of common presets plus an "Other…" option that reveals a free
 * text input — keeps data entry fast and consistent for the common case
 * (category/author picks) without blocking a value that isn't in the list.
 */
export function DropdownWithOther({
  id,
  value,
  options,
  onChange,
  placeholder = "Select an option",
  otherPlaceholder = "Enter a custom value",
}: DropdownWithOtherProps) {
  const isPreset = value === "" || options.includes(value);
  const [showOther, setShowOther] = useState(!isPreset);

  function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value;
    if (next === OTHER_VALUE) {
      setShowOther(true);
      onChange("");
    } else {
      setShowOther(false);
      onChange(next);
    }
  }

  return (
    <div className="space-y-2">
      <Select id={id} value={showOther ? OTHER_VALUE : value} onChange={handleSelectChange}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        <option value={OTHER_VALUE}>Other…</option>
      </Select>
      {showOther && (
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={otherPlaceholder}
          autoFocus
        />
      )}
    </div>
  );
}
