import express from "express"
import cors from "cors"

import apiRouter from "./routes/index.js"
import { requirePayload } from "./utils/payloadGuard.js"
import { requestLogger } from "./utils/requestLogger.js"
export const app = express()


app.use(express.json())
app.use(cors())

// Log every incoming request (and its response status) before routing.
app.use(requestLogger)


app.use("/api", requirePayload, apiRouter)


app.use((err, req, res, next) => {
    const status = err.status || 500
    const message = err.message || "Internal server error"
    res.status(status).json({ message })
})
