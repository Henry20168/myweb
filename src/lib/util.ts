import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const rates = {
  MAD: 1,
  EUR: 0.091,
  USD: 0.1,
};

export type CurrencyCode = keyof typeof rates;

export function getCurrency(): CurrencyCode {
  if (typeof document === "undefined") return "MAD";
  const fromCookie = document.cookie.split(";").map(s => s.trim()).find(s => s.startsWith("currency="))?.split("=")[1];
  const fromStorage = typeof window !== "undefined" ? window.localStorage.getItem("currency") || undefined : undefined;
  return (fromCookie || fromStorage || "MAD") as CurrencyCode;
}

export function formatPrice(amount: number) {
  const code = getCurrency();
  const rate = rates[code] || 1;
  const safeAmount = amount || 0;
  const converted = safeAmount * rate;
  
  const symbol = code === 'MAD' ? 'MAD' : code === 'EUR' ? '€' : '$';
  
  if (code === 'MAD') {
    return `${safeAmount.toLocaleString('en-MA')} MAD`;
  }
  
  return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatPriceParts(amount: number) {
  const code = getCurrency();
  const rate = rates[code] || 1;
  const safeAmount = amount || 0;
  const converted = safeAmount * rate;
  const symbol = code === 'MAD' ? 'MAD' : code === 'EUR' ? '€' : '$';
  
  return {
    value: converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
    symbol,
    isPrefix: code !== 'MAD',
    code
  };
}

export function formatMAD(amount: number) {
  return formatPrice(amount);
}

export function waLink(message: string) {
  const num = (process.env.NEXT_PUBLIC_WHATSAPP || '').replace(/[^\d]/g, '');
  if (num) return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
  // Fallback when number isn't configured: opens WhatsApp with prefilled message
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
}
