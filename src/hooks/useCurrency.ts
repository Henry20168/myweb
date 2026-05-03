"use client";

import { useEffect, useState } from "react";
import { CurrencyCode, getCurrency } from "@/lib/util";

export function useCurrency() {
  const [currency, setCurrency] = useState<CurrencyCode>("MAD");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrency(getCurrency());
    
    const handler = () => {
      setCurrency(getCurrency());
    };
    
    window.addEventListener("aalikouch-currency-change", handler);
    return () => window.removeEventListener("aalikouch-currency-change", handler);
  }, []);

  return currency;
}
