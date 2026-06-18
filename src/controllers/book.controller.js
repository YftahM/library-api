import { bookService } from "../services/book.service.js"

export const listBooks = async (req, res, next) => {
    try {
        const response = await bookService.listBooks(req.query)
        const { status, ...payload } = response
        res.status(status || 200).json(payload)
    } catch (error) {
        next(error)
    }
}

export const discoverBooks = async (req, res, next) => {
    try {
        const { q } = req.query
        const response = await bookService.discoverBooks(q)
        const { status, ...payload } = response
        res.status(status || 200).json(payload)
    } catch (error) {
        next(error)
    }
}

export const getBookById = async (req, res, next) => {
    try {
        const { bookId } = req.params
        const response = await bookService.getBookById(bookId)
        const { status, ...payload } = response
        res.status(status || 200).json(payload)
    } catch (error) {
        next(error)
    }
}
