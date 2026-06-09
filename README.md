# Task Tracker

A lightweight, local-first personal task and project manager. No login required — all data stays on your machine in SQLite.

## Features

- **Dashboard** — today's tasks, overdue count, active projects
- **Projects** — organize work into color-coded projects
- **Kanban board** — drag tasks between Backlog, To Do, In Progress, Done
- **List view** — tabular task overview per project
- **Subtasks** — nested checklists inside any task
- **Labels** — tag tasks and filter by label
- **Recurring tasks** — daily, weekly, or monthly; spawns next instance on completion
- **Today view** — cross-project due-today and overdue tasks

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- SQLite via `better-sqlite3` + Drizzle ORM
- Tailwind CSS 4
- `@dnd-kit` for kanban drag-and-drop

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Data is stored in `./data/tasks.db` (gitignored).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:push` | Push schema to database |

## Environment

Copy `.env.example` to `.env.local` if you need a custom data directory:

```
TASK_DATA_DIR=/path/to/your/data
```
