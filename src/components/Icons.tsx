import React from 'react';

export function IconBadge({ color = '#e5e7eb', children }: { color?: string; children: React.ReactNode }) {
  return (
    <span style={{ backgroundColor: color }} className="inline-flex h-6 w-6 items-center justify-center rounded-full ring-1 ring-gray-200">
      {children}
    </span>
  );
}

export const CarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 13l2-5a3 3 0 0 1 2.8-2h8.4A3 3 0 0 1 19 8l2 5"/>
    <rect x="2" y="12" width="20" height="6" rx="2"/>
    <circle cx="7" cy="17" r="1"/>
    <circle cx="17" cy="17" r="1"/>
  </svg>
);

export const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 7v5l3 2"/>
  </svg>
);

export const PinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10z"/>
    <circle cx="12" cy="11" r="2"/>
  </svg>
);

export const BoxIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 7l9 5 9-5-9-5-9 5z"/>
    <path d="M3 7v10l9 5 9-5V7"/>
    <path d="M12 12v10"/>
  </svg>
);

export const BabySeatIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="9" cy="7" r="2"/>
    <path d="M4 20h10a6 6 0 0 0 6-6v-1a3 3 0 0 0-3-3h-5a6 6 0 0 0-6 6v4z"/>
  </svg>
);

export const ReceiptIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 2l2 2 2-2 2 2 2-2 2 2v18l-2-2-2 2-2-2-2 2-2-2V2z"/>
    <path d="M8 7h8M8 11h8M8 15h6"/>
  </svg>
);

export const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3v12"/>
    <path d="M7 10l5 5 5-5"/>
    <path d="M5 21h14"/>
  </svg>
);

// New: spec icons
export const BrandIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="9"/>
    <path d="M8 12h8M12 8v8"/>
  </svg>
);

export const ModelIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="6" width="18" height="12" rx="2"/>
    <path d="M7 10h10M7 14h6"/>
  </svg>
);

export const CategoryIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 8h16M4 16h16"/>
    <circle cx="8" cy="8" r="1"/>
    <circle cx="8" cy="16" r="1"/>
  </svg>
);

export const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="9" cy="8" r="3"/>
    <path d="M2 21a7 7 0 0 1 14 0"/>
    <circle cx="17" cy="10" r="2"/>
    <path d="M22 21a5 5 0 0 0-7-4"/>
  </svg>
);

export const GearIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1 1 0 0 0 .2-1.1l-1-1.7 1-1.7a1 1 0 0 0-.2-1.1l-1.1-1.1a1 1 0 0 0-1.1-.2l-1.7 1-1.7-1a1 1 0 0 0-1.1.2L10 6.6a1 1 0 0 0-.2 1.1l1 1.7-1 1.7a1 1 0 0 0 .2 1.1l1.1 1.1a1 1 0 0 0 1.1.2l1.7-1 1.7 1a1 1 0 0 0 1.1-.2z"/>
  </svg>
);

export const FuelIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 21V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v15"/>
    <path d="M14 8H5"/>
    <path d="M18 7v7a3 3 0 0 0 3 3h0v-8l-2-2"/>
  </svg>
);

export const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
);

export const TagIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20.59 13.41L12 22 2 12l8.59-8.59A2 2 0 0 1 12.99 3H19a2 2 0 0 1 2 2v6.01a2 2 0 0 1-.41 1.4z"/>
    <circle cx="7.5" cy="12.5" r="1.5"/>
  </svg>
);

export const BoltIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>
  </svg>
);

export const DiamondIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 9l4-5h8l4 5-8 10z"/>
    <path d="M4 9h16"/>
    <path d="M10 4l4 5-4 10"/>
  </svg>
);

export const MotorcycleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="6" cy="18" r="3"/>
    <circle cx="18" cy="18" r="3"/>
    <path d="M6 15v-3a3 3 0 0 1 3-3h6l3-3"/>
    <path d="M18 15v-6a3 3 0 0 0-3-3h-3"/>
  </svg>
);
