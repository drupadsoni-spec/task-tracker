"use client";

import { AppShell } from "@/components/layout/sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
