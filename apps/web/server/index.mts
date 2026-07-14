import { parse } from "node:url"
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express"
import next from "next"
import { env, isDev } from "./env.mts"
import { createApiRouter } from "./api.mts"
import { logger } from "./logger.mts"

const nextApp = next({ dev: isDev })
const handle = nextApp.getRequestHandler()

// Paths we don't want to log (framework internals and static assets would
// otherwise flood the logs and drown out anything useful).
function isNoisyPath(url: string): boolean {
  return (
    url.startsWith("/_next/") ||
    url === "/favicon.ico" ||
    url.startsWith("/og/")
  )
}

function requestLogger(req: Request, res: Response, nextFn: NextFunction) {
  if (isNoisyPath(req.originalUrl)) return nextFn()

  const start = performance.now()
  res.on("finish", () => {
    const durationMs = Math.round(performance.now() - start)
    const payload = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs,
    }

    if (res.statusCode >= 500) logger.error(payload, "request failed")
    else if (res.statusCode >= 400) logger.warn(payload, "request client error")
    else logger.info(payload, "request completed")
  })

  nextFn()
}

function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  nextFn: NextFunction,
) {
  logger.error(
    { err, method: req.method, url: req.originalUrl },
    "unhandled request error",
  )
  if (res.headersSent) return nextFn(err)
  res.status(500).json({ error: "Internal Server Error" })
}

async function main() {
  logger.info({ dev: isDev }, "preparing Next.js")
  await nextApp.prepare()

  const server = express()
  server.use(express.json())
  server.use(requestLogger)

  server.use("/api/v1", createApiRouter())

  // Everything else is handled by Next.js (pages, RSC, docs, assets).
  server.all("*", (req: Request, res: Response) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  server.use(errorHandler)

  server.listen(env.PORT, () => {
    logger.info(
      { port: env.PORT, dev: isDev, url: `http://localhost:${env.PORT}` },
      "site is running",
    )
  })
}

process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "unhandled promise rejection")
})

process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "uncaught exception")
  process.exit(1)
})

main().catch((err) => {
  logger.fatal({ err }, "failed to start server")
  process.exit(1)
})
