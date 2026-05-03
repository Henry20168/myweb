"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function AdminHiddenWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin-aalikouch-panel");

  if (isAdminPage) return null;

  return <>{children}</>;
}
