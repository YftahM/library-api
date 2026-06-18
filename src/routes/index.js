import { Router } from "express";
import bookUrls from "./bookRoutes/index.js"
import catalogUrls from "./catalogRoutes/index.js"
import memberUrls from "./memberRoutes/index.js"
import loanUrls from "./loanRoutes/index.js"

const router = Router();

router.use("/books", bookUrls)
router.use("/catalog", catalogUrls)
router.use("/members", memberUrls)
router.use("/loans", loanUrls)

export default router
