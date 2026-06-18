import { Router } from "express";
import childrensUrls from "./childrens.routes.js"
import fictionUrls from "./fiction.routes.js"
import nonfictionUrls from "./nonfiction.routes.js"

const router = Router();

router.use("/childrens", childrensUrls)

router.use("/fiction", fictionUrls)

router.use("/nonfiction", nonfictionUrls)

export default router
