# Gemini CLI: Neighbourhood Borrow Board

Project-specific instructions for the Neighbourhood Borrow Board.

## Technical Standards

- **Backend:** Node.js with Express. REST API is in `server.js`.
- **Database:** Local `data.json` file for persistence. No external database.
- **Frontend:** Vanilla JavaScript, HTML5, and CSS3. No frontend frameworks or build steps.
- **Type Safety:** None (JS). Use JSDoc if documentation is needed for complex functions.
- **Styling:** Vanilla CSS in `public/style.css`. Avoid Tailwind or other CSS frameworks.
- **Security:** Always use `escapeHTML()` in `public/app.js` for rendering user-provided content to prevent XSS.

## Development Workflows

- **Starting the app:** Use `./init.sh` to install dependencies and start the server, or `npm start`.
- **API Development:** Add new endpoints in `server.js`. Ensure they update `data.json` correctly.
- **UI Development:** Modify `public/index.html` for structure and `public/app.js` for logic.
- **Testing:** No formal test suite currently exists. Verify changes by running the app and manually testing the UI/API.

## Project Structure

- `server.js`: Express server and REST API logic.
- `data.json`: JSON file acting as the database.
- `public/`: Static assets for the frontend.
  - `index.html`: Main application shell.
  - `app.js`: Frontend logic, API calls, and DOM manipulation.
  - `style.css`: Application styles.

## API Reference

- `GET /api/items`: Returns all items. Supports filtering via `category` and `available` query params.
- `POST /api/items`: Creates a new item.
- `PATCH /api/items/:id/borrow`: Borrows or returns an item.
- `DELETE /api/items/:id`: Deletes an item.

## Data Schema

```json
{
  "id": number,
  "name": string,
  "category": "Tools" | "Kitchen" | "Garden" | "Outdoor" | "Electronics" | "Sports" | "Other",
  "owner": string,
  "description": string,
  "available": boolean,
  "borrowedBy": string | null,
  "createdAt": string (ISO date)
}
```
