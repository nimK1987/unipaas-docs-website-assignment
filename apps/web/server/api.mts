import express, { type Request, type Response } from "express"
import { getDb } from "./db.mts"

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
    const db = getDb()
    const row = db.prepare("SELECT sqlite_version() AS version").get()
    res.json({ ok: true, sqlite: row })
  })

  return api
}
