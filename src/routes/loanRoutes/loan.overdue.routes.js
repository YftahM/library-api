import { Router } from "express";

const router = Router();

router.get("/:year", (req, res) => {
    const { year } = req.params
    res.send(year)
})

export default router
