import { DatabaseSync } from "node:sqlite"
import { env } from "./env.mts"
import { logger } from "./logger.mts"

let db: DatabaseSync | undefined

// Single shared connection. node:sqlite is synchronous, so a lazily-created
// singleton is the simplest correct pattern for a single-process server.
export function getDb(): DatabaseSync {
  if (db) return db

  try {
    const instance = new DatabaseSync(env.DB_PATH)
    instance.exec("PRAGMA journal_mode = WAL;")

    db = instance
    logger.info({ path: env.DB_PATH }, "sqlite database opened")
    return db
  } catch (err) {
    logger.error({ err, path: env.DB_PATH }, "failed to open sqlite database")
    throw err
  }
}
