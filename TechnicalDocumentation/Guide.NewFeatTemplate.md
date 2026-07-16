## How to Add a New Feature (Template)

When adding any new feature, follow this checklist:

### Backend
1. **Model** - Do you need a new database column or table? Add fields to existing entity or create new `@Entity` class in `model/`
2. **Repository** - Do you need a custom query? Add method to existing repository or create new interface extending `JpaRepository`
3. **Service** - Add business logic method to existing service or create new `@Service` class in `service/`
4. **Controller** - Add `@GetMapping`, `@PostMapping`, or `@PutMapping` method to appropriate controller, or create new `@RestController`
5. **Security** - If endpoint is public, add path to `SecurityConfig.java` permitted paths

### Frontend
1. **api.js** - Add new function to appropriate service object
2. **Page or Component** - Add UI in existing page or create new file in `Pages/`
3. **App.js** - If new page, add `<Route>` entry

### Example: Adding Delete Account Feature
**Backend:**
- `UserController.java` - add `@DeleteMapping("/me")` method
- Method reads email from JWT, finds user, deletes all their assignments first, then deletes user
- No new repository methods needed since `deleteById()` comes from `JpaRepository`

**Frontend:**
- `Settings.js` - add Delete Account button in a danger zone section
- `api.js` - add `deleteAccount: () => api.delete('/users/me')`
- On success, clear localStorage token and navigate to /login

**Database impact:**
- Deleting a user cascades to assignments if you add `cascade = CascadeType.ALL` to the `@OneToMany` on User, otherwise delete assignments first manually