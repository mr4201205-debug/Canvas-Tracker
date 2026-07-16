## Feature: User Registration

### Purpose
Allow new students to create a ClassSync account. Accounts require email verification before login is permitted.

### Frontend Files
- `src/Pages/Register.js` - Registration form
- `src/Services/api.js` - `authService.register()`

### Backend Classes
- `AuthController.java` - `POST /auth/register`
- `EmailService.java` - `sendVerificationEmail()`
- `UserRepository.java` - `save()`, `findByEmail()`

### Database Tables
- `users` - inserts new row

### Request Flow
Register.js (form submit)

→ authService.register(name, email, password, canvasBaseUrl)

→ POST /auth/register

→ AuthController.register()

→ Check if email already exists (UserRepository.findByEmail)

→ BCrypt encode password

→ Generate UUID verification token

→ Save user with is_verified=false

→ EmailService.sendVerificationEmail() [async]

→ Return 200 "Registration successful"

→ Register.js shows success message

→ After 2 seconds, redirect to /login

### How to Extend
To add a field to registration (e.g. university name):
1. Add field to `User.java` with getter and setter
2. Spring Boot auto-creates the column in the database
3. Add input field to `Register.js`
4. Add field to the `register()` call in `api.js`
5. No changes needed to `AuthController` since `@RequestBody User user` maps all fields automatically

---