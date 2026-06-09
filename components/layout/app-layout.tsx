"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/layout/sidebar";
import { QuickCapture } from "@/components/layout/quick-capture";
import { CommandPalette } from "@/components/layout/command-palette";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const captureRef = useRef<HTMLInputElement>(null);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
      if (e.key === "/" && !paletteOpen) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        e.preventDefault();
        captureRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [paletteOpen]);

  return (
    <AppShell onOpenSearch={openPalette}>
      <QuickCapture inputRef={captureRef} />
      {children}
      <CommandPalette open={paletteOpen} onClose={closePalette} />
    </AppShell>
  );
}
