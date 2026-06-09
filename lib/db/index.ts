import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import fs from "fs";
import path from "path";
import * as schema from "./schema";
import { seedDefaults } from "./seed";

const DATA_DIR = process.env.TASK_DATA_DIR ?? path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "tasks.db");
const MIGRATIONS_DIR =
  process.env.TASK_MIGRATIONS_DIR ?? path.join(process.cwd(), "drizzle");

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getDb() {
  if (dbInstance) return dbInstance;

  ensureDataDir();
  const sqlite = new Database(DB_PATH);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");

  dbInstance = drizzle(sqlite, { schema });

  if (fs.existsSync(MIGRATIONS_DIR)) {
    migrate(dbInstance, { migrationsFolder: MIGRATIONS_DIR });
  }

  seedDefaults(dbInstance);

  return dbInstance;
}
