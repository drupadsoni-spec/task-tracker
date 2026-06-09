# Task Tracker

A local-first personal task manager inspired by **Google Tasks**, **Todoist**, and **Things** — with kanban boards, labels, subtasks, and recurring tasks. No account required; your data stays in SQLite on your machine.

**Repository:** https://github.com/drupadsoni-spec/task-tracker

## Why Task Tracker?

| Feature | Google Tasks | Todoist | Task Tracker |
|---------|-------------|---------|--------------|
| Quick capture | Gmail sidebar | Natural language | Global Inbox bar |
| Kanban board | No | Yes (Pro) | Yes |
| Labels / tags | No | Yes | Yes |
| Subtasks | 1 level | Nested | 1 level + checklists |
| Recurring tasks | Yes | Yes | Yes |
| Global search | No | Yes | ⌘K command palette |
| Local / private | Cloud only | Cloud | **100% local SQLite** |
| Price | Free | Freemium | Free & open source |

## Features

- **Quick capture** — add tasks to Inbox from any page (`/` to focus)
- **⌘K search** — find tasks by title or description instantly
- **Dashboard** — today, overdue, in-progress, recent activity
- **Today & Upcoming** — Things-style date-focused views
- **Projects** — color-coded with kanban + list views
- **Kanban** — drag tasks across Backlog → To Do → In Progress → Done
- **Subtasks** — checklists inside any task
- **Labels** — tag and filter tasks
- **Due date presets** — Today, Tomorrow, Next week
- **Recurring tasks** — daily / weekly / monthly; auto-spawns on complete
- **Deep links** — open a specific task via `?task=123`
- **Keyboard shortcuts** — `⌘K` search, `/` focus capture

## Screenshots

> Run `npm run dev` and open http://localhost:3000 to explore the app.

## Getting Started

```bash
git clone https://github.com/drupadsoni-spec/task-tracker.git
cd task-tracker
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

Copy `.env.example` to `.env.local` for a custom data directory:

```
TASK_DATA_DIR=/path/to/your/data
```

## Roadmap

- [ ] Natural language due dates ("tomorrow", "next friday")
- [ ] Dark mode
- [ ] Task time / reminders
- [ ] Export / backup
- [ ] Electron desktop wrapper

## License

MIT — see [LICENSE](LICENSE).

Designed by [Drupad Soni](https://github.com/drupadsoni-spec).
