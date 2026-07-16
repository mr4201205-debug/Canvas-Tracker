## Feature: Email Verification
### Purpose
Ensure users own the email address they registered with before allowing login.

### Frontend Files
- `src/Pages/Verify.js` - Handles the verification link click
- `src/Pages/Login.js` - Shows resend option if user is unverified

### Backend Classes
- `AuthController.java` - `GET /auth/verify`, `POST /auth/resend-verification`
- `EmailService.java` - `sendVerificationEmail()`
- `UserRepository.java` - `findByVerificationToken()`

### Database Tables
- `users` - `verification_token`, `is_verified` columns

### Request Flow
User clicks link in email

→ Browser opens classsync33.netlify.app/verify?token=UUID

→ Verify.js reads token from URL params

→ GET /auth/verify?token=UUID

→ AuthController.verifyEmail()

→ UserRepository.findByVerificationToken(token)

→ Set is_verified=true, clear verification_token

→ Save user

→ Return 200 "Email verified successfully"

→ Verify.js shows success, redirects to /login after 3 seconds

### How to Extend
To add token expiry (currently tokens never expire):
1. Add `verificationTokenExpiry` timestamp field to `User.java`
2. Set it to `LocalDateTime.now().plusHours(24)` in `AuthController.register()`
3. In `AuthController.verifyEmail()` add check: `if (user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) return 400`

---