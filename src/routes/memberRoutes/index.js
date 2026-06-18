import { Router } from "express";
import accessUrls from "./member.access.routes.js"
import profileUrls from "./member.profile.routes.js"

const router = Router();

router.use("/access", accessUrls)
router.use("/profile", profileUrls)

export default router
