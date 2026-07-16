## Feature: Login and JWT Authentication

### Purpose
Authenticate users and issue JWT tokens that authorize all subsequent requests.

### Frontend Files
- `src/Pages/Login.js` - Login form
- `src/Services/api.js` - `authService.login()`, interceptor adds token to all requests

### Backend Classes
- `AuthController.java` - `POST /auth/login`
- `JwtService.java` - `generateToken()`, `isTokenValid()`, `extractEmail()`
- `JwtFilter.java` - Intercepts every request, validates token
- `SecurityConfig.java` - Defines which endpoints require authentication

### Database Tables
- `users` - reads `password`, `is_verified`

### Request Flow
Login.js (form submit)

→ authService.login(email, password)

→ POST /auth/login

→ AuthController.login()

→ UserRepository.findByEmail()

→ BCrypt.matches(inputPassword, storedHash)

→ Check is_verified=true

→ JwtService.generateToken(email)

→ Return 200 with JWT token string

→ Login.js saves token to localStorage

→ Navigate to /dashboard

### Every Subsequent Request Flow
Any API call from React

→ api.js interceptor reads token from localStorage

→ Adds Authorization: Bearer <token> header

→ JwtFilter.doFilterInternal()

→ Extracts token from header

→ JwtService.isTokenValid(token)

→ JwtService.extractEmail(token)

→ Sets authentication in SecurityContextHolder

→ Request proceeds to controller

→ Controller reads email via authentication.getName()

### How to Extend
To add role-based access (e.g. admin vs student):
1. Add `role` field to `User.java` with enum type
2. Store role in JWT token via `JwtService.generateToken(email, role)`
3. Add role check in `SecurityConfig` via `.hasRole("ADMIN")`

---
