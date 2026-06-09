import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppLayout } from "@/components/layout/app-layout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Tracker — Local-first personal PM",
  description:
    "Kanban boards, labels, subtasks, and recurring tasks. Inspired by Google Tasks and Todoist. 100% local SQLite.",
  openGraph: {
    title: "Task Tracker",
    description: "Local-first personal task and project manager",
    url: "https://github.com/drupadsoni-spec/task-tracker",
    siteName: "Task Tracker",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
