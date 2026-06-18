import { Router } from "express"
import bookUrls from "./book.routes.js"

const router = Router()

router.use("/", bookUrls)

export default router
