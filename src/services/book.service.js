/*
 * Book business logic.
 *
 * Validates input, talks to the DAL for the in-memory catalog, and to the
 * external Open Library API for the "discover" feature. Kept free of any
 * Express/HTTP details so it stays framework-agnostic and easy to unit test.
 */
import { bookRepository } from "../dal/book.dal.js"
import { searchOpenLibrary } from "../utils/booksApi.js"
import { createLogger } from "../utils/logger.js"

const logger = createLogger("BOOK-SERVICE")

function badRequest(message) {
    const err = new Error(message)
    err.status = 400
    return err
}

// Parse the raw "available" query string into a boolean (or undefined).
function parseAvailable(raw) {
    if (raw === undefined) return undefined
    if (raw === "true") return true
    if (raw === "false") return false
    throw badRequest("available must be either 'true' or 'false'")
}

export const bookService = {
    // Simple route + query filters: list books in the catalog.
    listBooks: async (query = {}) => {
        const filters = {
            genre: typeof query.genre === "string" ? query.genre : undefined,
            author: typeof query.author === "string" ? query.author : undefined,
            available: parseAvailable(query.available),
        }

        const books = await bookRepository.findAll(filters)
        logger.info(`Listing ${books.length} book(s)`)

        return {
            status: 200,
            count: books.length,
            books,
        }
    },

    // Params route: fetch a single book by its id.
    getBookById: async (bookId) => {
        if (typeof bookId !== "string" || bookId.trim().length === 0) {
            throw badRequest("bookId must be a non-empty string")
        }

        const book = await bookRepository.findById(bookId)
        if (!book) {
            const err = new Error("Book not found")
            err.status = 404
            throw err
        }

        return { status: 200, book }
    },

    // External API route: discover books from Open Library by free-text query.
    discoverBooks: async (query) => {
        if (typeof query !== "string" || query.trim().length === 0) {
            throw badRequest("Query parameter 'q' is required")
        }

        const results = await searchOpenLibrary(query.trim(), 5)

        return {
            status: 200,
            query: query.trim(),
            count: results.length,
            results,
        }
    },
}
