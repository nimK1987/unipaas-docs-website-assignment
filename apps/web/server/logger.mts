import pino, { type LoggerOptions } from "pino"
import { isDev } from "./env.mts"

const options: LoggerOptions = {
  // Emit info and above to the console (stdout).
  level: "info",
}

// Pretty, human-readable output in development; structured JSON in production
// (which is what log aggregators expect).
if (isDev) {
  options.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  }
}

export const logger = pino(options)
