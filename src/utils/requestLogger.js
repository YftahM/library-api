/*
 * Request logging middleware.
 *
 * Logs every incoming request (method + url) as required by the guidelines,
 * and logs the response status code together with the time it took to serve.
 */
import { createLogger } from "./logger.js"

const logger = createLogger("HTTP")

export const requestLogger = (req, res, next) => {
    const startedAt = process.hrtime.bigint()

    logger.info(`Incoming ${req.method} ${req.originalUrl}`)

    res.on("finish", () => {
        const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000
        logger.http(
            `${req.method} ${req.originalUrl} -> ${res.statusCode} (${elapsedMs.toFixed(1)}ms)`
        )
    })

    next()
}
