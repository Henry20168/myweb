"use client";

import { useEffect, useState } from "react";
import { CompareItem } from "./ComparisonBar";

export default function CompareButton({ item }: { item: CompareItem }) {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("comparisonList");
    if (saved) {
      try {
        const list = JSON.parse(saved);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelected(list.some((i: CompareItem) => i.id === item.id));
      } catch {}
    }

    const handler = (e: Event) => {
      setSelected((e as CustomEvent<CompareItem[]>).detail.some((i: CompareItem) => i.id === item.id));
    };
    window.addEventListener("aalikouch-compare-change", handler);
    return () => window.removeEventListener("aalikouch-compare-change", handler);
  }, [item.id]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const saved = localStorage.getItem("comparisonList");
    let list: CompareItem[] = [];
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch {}
    }

    if (selected) {
      list = list.filter(i => i.id !== item.id);
    } else {
      if (list.length >= 3) {
        alert("You can only compare up to 3 items at a time.");
        return;
      }
      list.push(item);
    }

    localStorage.setItem("comparisonList", JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("aalikouch-compare-change", { detail: list }));
    setSelected(!selected);
  };

  return (
    <button
      onClick={toggle}
      title={selected ? "Remove from comparison" : "Add to comparison"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
        selected 
          ? "bg-[var(--brand)] border-[var(--brand)] text-white" 
          : "bg-white border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300"
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    </button>
  );
}
