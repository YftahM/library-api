/*
 * Book data-access layer.
 *
 * Loads a seed catalog of books from books.data.json into memory and exposes
 * read operations. This simulates a database using an in-memory array, as
 * suggested by the guidelines.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, "books.data.json")

const books = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"))

export const bookRepository = {
    // Return every book, optionally narrowed by a set of filters.
    findAll: async (filters = {}) => {
        let result = books

        if (typeof filters.genre === "string") {
            const genre = filters.genre.toLowerCase()
            result = result.filter((book) => book.genre.toLowerCase() === genre)
        }
        if (typeof filters.author === "string") {
            const author = filters.author.toLowerCase()
            result = result.filter((book) => book.author.toLowerCase().includes(author))
        }
        if (typeof filters.available === "boolean") {
            result = result.filter((book) => book.available === filters.available)
        }

        return result
    },

    findById: async (bookId) => {
        return books.find((book) => book.id === bookId) || null
    },
}
