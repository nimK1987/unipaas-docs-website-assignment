import { z } from "zod"

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  DB_PATH: z.string().default("data.db"),
})

export const env = envSchema.parse(process.env)

export const isDev = env.NODE_ENV !== "production"
