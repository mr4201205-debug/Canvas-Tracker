## Feature: Password Reset

### Purpose
Allow users who forgot their password to reset it via email link.

### Frontend Files
- `src/Pages/ForgotPassword.js` - Email input form
- `src/Pages/ResetPassword.js` - New password form
- `src/Services/api.js` - `authService.forgotPassword()`, `authService.resetPassword()`

### Backend Classes
- `AuthController.java` - `POST /auth/forgot-password`, `POST /auth/reset-password`
- `EmailService.java` - `sendPasswordResetEmail()`
- `UserRepository.java` - `findByEmail()`, `findByPasswordResetToken()`

### Database Tables
- `users` - `password_reset_token`, `password_reset_expiry`, `password` columns

### Request Flow (Request reset)
ForgotPassword.js (form submit)

→ authService.forgotPassword(email)

→ POST /auth/forgot-password

→ AuthController.forgotPassword()

→ UserRepository.findByEmail(email)

→ Generate UUID token

→ Set passwordResetToken and passwordResetExpiry (now + 1 hour)

→ Save user

→ EmailService.sendPasswordResetEmail() [async]

→ Return 200 (always, even if email not found - security)

### Request Flow (Perform reset)
User clicks link in email

→ Browser opens classsync33.netlify.app/reset-password?token=UUID

→ ResetPassword.js reads token from URL

→ authService.resetPassword(token, newPassword)

→ POST /auth/reset-password

→ AuthController.resetPassword()

→ UserRepository.findByPasswordResetToken(token)

→ Check passwordResetExpiry is not in the past

→ BCrypt encode new password

→ Clear passwordResetToken and passwordResetExpiry

→ Save user

→ Return 200 "Password reset successfully"

→ ResetPassword.js shows success, redirects to /login after 3 seconds

---