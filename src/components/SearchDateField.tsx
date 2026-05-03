"use client";

import { useEffect, useState } from "react";
import RedDatePicker from "./RedDatePicker";

interface SearchDateFieldProps {
  name: string;
}

export default function SearchDateField({ name }: SearchDateFieldProps) {
  const [value, setValue] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return (
    <div className="h-10 w-full rounded-md border border-gray-300 bg-gray-50 animate-pulse" />
  );

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <RedDatePicker value={value} onChange={setValue} />
    </>
  );
}
