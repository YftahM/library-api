# Library API

- Name: Yftah Mazor / יפתח מזור
- ID: 330955428

A modular **Node.js + Express** REST API for a small library system.
It exposes a book catalog, library-member access (sign-in / enroll / password
rotation) and member profiles, logs every incoming request, and integrates with
an **external API** ([Open Library](https://openlibrary.org)) to discover books
that are not in the local catalog.

The project is written entirely in **ES Modules** and is split into clean,
single-responsibility layers:

```
library-api/
├── server.js                 # entry point – starts the HTTP server
├── .env / .env.example       # environment configuration
└── src/
    ├── app.js                # express app, middleware & error handler
    ├── config/               # environment-driven configuration
    ├── routes/               # routing only (books, catalog, members, loans)
    ├── controllers/          # parse request / shape response
    ├── services/             # business logic (framework-agnostic)
    ├── dal/                  # data-access layer (in-memory + JSON files)
    └── utils/                # logger, request logger, external API client, guards
```

## Requirements

- Node.js 18+ (uses the built-in global `fetch`)

## Installation & Run

```bash
npm install
npm start
```

The server starts on `http://localhost:3000` (configurable via `PORT` in `.env`).
For development with auto-reload:

```bash
npm run dev
```

## Logging

Every incoming request is logged via [winston](https://github.com/winstonjs/winston)
(`logger.info`) together with its response status and duration. Logs are printed
to the console and written to `logs/combined.log` (and `logs/error.log`), which
are git-ignored.

## The three required GET routes

| # | Type | Endpoint | Description |
|---|------|----------|-------------|
| 1 | Simple + query params | `GET /api/books` | Lists the local catalog; supports `?genre=`, `?author=`, `?available=` filters |
| 2 | URL parameter | `GET /api/books/:bookId` | Returns a single book from the catalog (DAL) |
| 3 | External API | `GET /api/books/discover?q=` | Searches Open Library for books matching `q` |

### Example calls

```bash
# 1) Simple list (all books)
curl http://localhost:3000/api/books

# 1b) With query filters
curl "http://localhost:3000/api/books?genre=fiction&available=true"

# 2) Single book by id
curl http://localhost:3000/api/books/book-001

# 3) External API – discover books from Open Library
curl "http://localhost:3000/api/books/discover?q=tolkien"
```

Example response for `GET /api/books/book-001`:

```json
{
  "book": {
    "id": "book-001",
    "title": "Dune",
    "author": "Frank Herbert",
    "genre": "fiction",
    "year": 1965,
    "available": true
  }
}
```

## Other endpoints

These pre-existing endpoints round out the library domain.

### Members – access (`/api/members/access`)
- `POST /enroll/:sponsorId` — create a member (`{ email, password, displayName }`)
- `POST /signin` — authenticate (`{ email, password }`)
- `POST /recover` — request credential recovery (`{ email }`)
- `PATCH /rotate` — change password (`{ email, currentPassword, newPassword }`)

### Members – profile (`/api/members/profile`)
- `GET /:memberId` — fetch a profile
- `POST /:memberId` — create a profile (`{ displayName, biography? }`)
- `PUT /:memberId` — replace a profile
- `DELETE /:memberId` — remove a profile

### Catalog & loans (stubs)
- `GET /api/catalog/fiction/bestsellers`
- `GET /api/loans/overdue/:year`

> Passwords are hashed with **bcrypt**. Member data is persisted to
> `src/dal/members.data.json`; the book catalog is seeded from
> `src/dal/books.data.json`.

## Notes

- All asynchronous work uses `async/await`, including the external network call.
- Business logic lives in the `services` layer and is independent of Express,
  which keeps it portable and unit-testable.
