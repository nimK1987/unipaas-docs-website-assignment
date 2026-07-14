import { DatabaseSync } from "node:sqlite"
import { env } from "./env.mts"

let db: DatabaseSync | undefined

// Single shared connection. node:sqlite is synchronous, so a lazily-created
// singleton is the simplest correct pattern for a single-process server.
export function getDb(): DatabaseSync {
  if (db) return db

  const instance = new DatabaseSync(env.DB_PATH)
  instance.exec("PRAGMA journal_mode = WAL;")

  db = instance
  return db
}
