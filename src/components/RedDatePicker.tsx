"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";

interface RedDatePickerProps {
  label?: string;
  value: string; // yyyy-mm-dd or ""
  onChange: (value: string) => void;
  minDate?: Date;
}

function parseDate(value: string | null): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

function formatDateIso(d: Date | undefined): string {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function RedDatePicker({ label, value, onChange, minDate }: RedDatePickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selected = parseDate(value || null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const min = (() => {
    const base = minDate ? new Date(minDate) : today;
    base.setHours(0, 0, 0, 0);
    return base;
  })();

  const displayText = selected
    ? selected.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Select your date";

  // close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={rootRef} className="relative text-sm inline-block w-full">
      {label && <div className="mb-1 text-xs text-gray-600">{label}</div>}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex w-full items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm text-left"
      >
        <span className="flex items-center gap-2">
          <span className="text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-4 w-4"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="1.5" />
              <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.5" />
              <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.5" />
              <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.5" />
            </svg>
          </span>
          <span className={selected ? "text-gray-900" : "text-gray-500"}>{displayText}</span>
        </span>
      </button>
      {open && (
        <div className="absolute z-30 mt-1 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
          <DayPicker
            mode="single"
            selected={selected}
            disabled={{ before: min }}
            onSelect={(d) => {
              const iso = formatDateIso(d || undefined);
              onChange(iso);
              if (d) setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
