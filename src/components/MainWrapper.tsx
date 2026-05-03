"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin-aalikouch-panel");

  return (
    <main className={isAdminPage ? "" : "mx-auto max-w-6xl px-4 py-8"} suppressHydrationWarning>
      {children}
    </main>
  );
}
