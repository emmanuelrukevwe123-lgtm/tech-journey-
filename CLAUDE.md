# Neighbourhood Borrow Board

A local mini library web app where neighbours can list tools and items for others to borrow.

## Running the project

```bash
./init.sh        # installs deps if needed, then starts the server
# or
npm start        # if node_modules already exists
```

Server runs at **http://localhost:3000**.

## Project structure

```
server.js          — Express REST API + static file serving
data.json          — Persistent storage (auto-created on first run with seed data)
init.sh            — Bootstrap script
public/
  index.html       — App shell, modals (Add Item, Borrow)
  style.css        — All styles (CSS variables, card grid, modals, toasts)
  app.js           — Fetch, render, filter, and all UI interactions
```

No build step. No database. Vanilla JS frontend.

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | List all items. Query params: `category`, `available` |
| POST | `/api/items` | Add a new item |
| PATCH | `/api/items/:id/borrow` | Borrow (pass `borrowerName`) or return (no body) |
| DELETE | `/api/items/:id` | Remove a listing |

## Data shape

```json
{
  "id": 1,
  "name": "Cordless Drill",
  "category": "Tools",
  "owner": "Alice (No. 12)",
  "description": "DeWalt 20V, comes with a bit set.",
  "available": true,
  "borrowedBy": null,
  "createdAt": "2026-04-03T18:00:00.000Z"
}
```

Valid categories: `Tools`, `Kitchen`, `Garden`, `Outdoor`, `Electronics`, `Sports`, `Other`

## Key decisions

- **No database** — `data.json` is sufficient for a neighbourhood-scale app. Replace with SQLite or similar if the dataset grows.
- **No auth** — Trust-based, like a real community board. Users self-identify by name/house number.
- **No framework** — Vanilla JS keeps the frontend zero-dependency and fast to load.
- **XSS protection** — All user content is escaped via `escapeHTML()` in `app.js` before being inserted into the DOM.
