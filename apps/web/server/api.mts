import express, { type Request, type Response } from "express"
import { getDb } from "./db.mts"
import { logger } from "./logger.mts"

// Backend API. Mounted under /api/v1 so it never collides with Next's own
// route handlers (e.g. /api/search used by Fumadocs).
export function createApiRouter() {
  const api = express.Router()

  api.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" })
  })

  api.get("/hello", (_req: Request, res: Response) => {
    res.send("hello")
  })

  api.get("/db/ping", (_req: Request, res: Response) => {
    try {
      const db = getDb()
      const row = db.prepare("SELECT sqlite_version() AS version").get()
      res.json({ ok: true, sqlite: row })
    } catch (err) {
      logger.error({ err }, "db ping failed")
      res.status(500).json({ ok: false, error: "database unavailable" })
    }
  })

  // Anything under /api/v1 that didn't match a route above.
  api.use((req: Request, res: Response) => {
    logger.warn({ method: req.method, url: req.originalUrl }, "unknown API route")
    res.status(404).json({ error: "Not Found" })
  })

  return api
}
