/*
 * External API client for the Open Library search service.
 *
 * Open Library:
 * https://openlibrary.org/search.json?q=...
 * using built-in fetch + async/await to query it and return a small,
 * normalized subset of the results.
 */
import { createLogger } from "./logger.js"

const logger = createLogger("BOOKS-API")

const OPEN_LIBRARY_SEARCH = "https://openlibrary.org/search.json"

const buildSearchUrl = (query, limit) => {
    const params = new URLSearchParams({ q: query, limit: String(limit) })
    return `${OPEN_LIBRARY_SEARCH}?${params.toString()}`
}

// Search Open Library for books matching `query`. Returns up to `limit` items.
export const searchOpenLibrary = async (query, limit = 5) => {
    const url = buildSearchUrl(query, limit)
    logger.info(`Requesting Open Library: ${url}`)

    let response
    try {
        response = await fetch(url)
    } catch (cause) {
        logger.error(`Network error reaching Open Library: ${cause.message}`)
        const err = new Error("Failed to reach the Open Library service")
        err.status = 502
        throw err
    }

    if (!response.ok) {
        logger.error(`Open Library responded with status ${response.status}`)
        const err = new Error("Failed to reach the Open Library service")
        err.status = 502
        throw err
    }

    const data = await response.json()
    const docs = Array.isArray(data.docs) ? data.docs : []

    const results = docs.slice(0, limit).map((doc) => ({
        title: doc.title ?? null,
        author: Array.isArray(doc.author_name) ? doc.author_name[0] : null,
        firstPublishedYear: doc.first_publish_year ?? null,
        openLibraryKey: doc.key ?? null,
    }))

    logger.debug(`Open Library returned ${results.length} result(s) for "${query}"`)
    return results
}
