import { Router } from "express";

const router = Router();

router.get("/bestsellers", (req, res) => {
    res.send("Top fiction shelf")
})


export default router
