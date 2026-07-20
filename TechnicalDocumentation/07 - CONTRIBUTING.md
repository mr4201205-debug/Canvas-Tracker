# How to Contribute
## Project Structure

```text
canvas-tracker/

├── src/main/java/com/canvastracker/canvas_tracker/

│   ├── controller/    # HTTP endpoints

│   ├── service/       # Business logic

│   ├── repository/    # Database queries

│   ├── model/         # Database entities

│   ├── security/      # JWT and auth

│   └── scheduler/     # Scheduled tasks

├── class-sync-frontend/src/

│   ├── Pages/         # React page components

│   ├── Components/    # Reusable React components

│   └── Services/      # API call functions

└── TechnicalDocumentation/              # Technical documentation
```
## How to Add a Feature

### 1. Plan it first
Before writing code, identify:
- Which database tables are affected
- Which backend classes need changes
- Which frontend files need changes
- What the API endpoint will look like

Refer to [FEATURES.md](04%20-%20FEATURES.md) for examples of how existing features are structured.

### 2. Backend pattern
Every feature follows this layered pattern:
Controller → Service → Repository → Database

- Controllers handle HTTP requests and responses only
- Services contain all business logic and validation
- Repositories handle all database operations
- Never skip layers, controllers should never call repositories directly

### 3. Frontend pattern
Every API call goes through `src/Services/api.js`. Never use axios directly in a component. Always add new API calls to the appropriate service object in `api.js`.

### 4. Security rules
- Every new endpoint requires authentication unless it is under `/auth/**`
- Never return sensitive fields like password, canvasToken, or verificationToken in API responses
- Always use `authentication.getName()` to identify the current user, never trust user-provided IDs
- Canvas tokens must be encrypted using `EncryptionService` before saving

### 5. Testing
Write a unit test for every new service method. Tests live in `src/test/java/com/canvastracker/canvas_tracker/`.

### 6. Documentation
Update `TechnicalDocumentation/FEATURES.md` with the new feature including purpose, files involved, and request flow. Update `docs/API.md` with any new endpoints.

### 7. Commit and push
git add `(name of the file)`

git commit -m "descriptive message of what you built"

git push

## Common Tasks

### Adding a new database column
1. Add field to the entity class in `model/` with getter and setter
2. Spring Boot automatically adds the column on next startup due to `ddl-auto=update`
3. No SQL migration needed for development

### Adding a new API endpoint
1. Add method to appropriate controller with `@GetMapping`, `@PostMapping`, `@PutMapping`, or `@DeleteMapping`
2. Add corresponding service method
3. Add to `api.js` in frontend
4. Document in `docs/API.md`

### Adding a new page
1. Create file in `class-sync-frontend/src/Pages/`
2. Use named or default export consistently with existing pages
3. Add route in `App.js`
4. Add navigation link in sidebar if applicable

## Environment Variables

Never commit secrets. All sensitive values go in:
- Backend: `src/main/resources/application-secrets.properties` (gitignored)
- Frontend: `.env.local` in `class-sync-frontend/` (gitignored)

Production secrets are set in Render and Netlify dashboards only.