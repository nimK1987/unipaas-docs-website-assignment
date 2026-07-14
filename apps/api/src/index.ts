import express, { type Request, type Response } from "express"
import { z } from "zod"

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
})

const env = envSchema.parse(process.env)

const app = express()

app.use(express.json())

app.get("/", (_req: Request, res: Response) => {
  res.send("hello")
})

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" })
})

app.listen(env.PORT, () => {
  console.log(`api listening on http://localhost:${env.PORT}`)
})
