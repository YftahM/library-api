import { Router } from "express"
import { listBooks, discoverBooks, getBookById } from "../../controllers/book.controller.js"

const router = Router()

// Default route + query filters (?genre=&author=&available=).
router.get("/", listBooks)

// External API route.
router.get("/discover", discoverBooks)

// Params route: a single book by id.
router.get("/:bookId", getBookById)

export default router
