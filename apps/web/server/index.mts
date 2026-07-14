import { parse } from "node:url"
import express, { type Request, type Response } from "express"
import next from "next"
import { env, isDev } from "./env.mts"
import { createApiRouter } from "./api.mts"

const nextApp = next({ dev: isDev })
const handle = nextApp.getRequestHandler()

async function main() {
  await nextApp.prepare()

  const server = express()
  server.use(express.json())

  server.use("/api/v1", createApiRouter())

  // Everything else is handled by Next.js (pages, RSC, docs, assets).
  server.all("*", (req: Request, res: Response) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  server.listen(env.PORT, () => {
    console.log(`site running on http://localhost:${env.PORT} (dev=${isDev})`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
