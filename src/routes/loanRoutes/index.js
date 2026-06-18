import { Router } from "express";
import activeUrls from "./loan.active.routes.js"
import returnedUrls from "./loan.returned.routes.js"
import overdueUrls from "./loan.overdue.routes.js"

const router = Router();

router.use("/active", activeUrls)

router.use("/returned", returnedUrls)

router.use("/overdue", overdueUrls)

export default router
