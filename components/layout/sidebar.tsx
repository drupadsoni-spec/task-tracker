"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarRange,
  FolderKanban,
  Tags,
  Menu,
  X,
  CheckSquare,
  Search,
  Inbox,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/today", label: "Today", icon: CalendarDays },
  { href: "/upcoming", label: "Upcoming", icon: CalendarRange },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/labels", label: "Labels", icon: Tags },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {navItems.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground/80 hover:bg-white/10 hover:text-sidebar-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </>
  );
}

type SidebarProps = {
  onOpenSearch?: () => void;
};

export function Sidebar({ onOpenSearch }: SidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="fixed left-4 top-4 z-50 rounded-lg bg-sidebar p-2 text-sidebar-foreground lg:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar px-4 py-6 transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-8 flex items-center gap-3 px-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <CheckSquare className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-sidebar-foreground">Task Tracker</p>
            <p className="text-xs text-sidebar-foreground/60">Personal PM</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          <NavLinks onNavigate={() => setOpen(false)} />
          {onOpenSearch && (
            <button
              type="button"
              onClick={() => {
                onOpenSearch();
                setOpen(false);
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-white/10 hover:text-sidebar-foreground"
            >
              <Search className="h-4 w-4" />
              Search
              <kbd className="ml-auto rounded bg-white/10 px-1.5 text-[10px]">⌘K</kbd>
            </button>
          )}
          <Link
            href="/inbox"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-white/10 hover:text-sidebar-foreground"
          >
            <Inbox className="h-4 w-4" />
            Inbox
          </Link>
        </nav>
        <div className="mt-auto px-3 pt-6 text-xs text-sidebar-foreground/40">
          <p>Designed by Drupad Soni</p>
          <p className="mt-1">v{process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0"}</p>
        </div>
      </aside>
    </>
  );
}

export function AppShell({
  children,
  onOpenSearch,
}: {
  children: React.ReactNode;
  onOpenSearch?: () => void;
}) {
  return (
    <div className="min-h-screen lg:pl-64">
      <Sidebar onOpenSearch={onOpenSearch} />
      <main className="px-4 py-16 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
