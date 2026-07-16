# All Endpoints Documented
## Base URL
- **Production:** `https://canvas-tracker.onrender.com`
- **Local:** `http://localhost:8080`

## Authentication
All endpoints except `/auth/**` and `/health` require a JWT token in the Authorization header.  
Authorization: Bearer token.   
Tokens expire after 24 hours. Re-authenticate via `/auth/login` to get a new token.   
For example -  
{  
"email": "aaaa@gmail.com",  
"password": "ppp007"  
}

## Endpoints

### Auth

#### POST /auth/register
Register a new user account.

**Request:**
```json
{
  "name": "user_name",
  "email": "user@example.com",
  "password": "any_password",
  "canvasBaseUrl": "montclair.instructure.com"
}
```

**Response:** `200 OK` - "Registration successful. Please check your email to verify your account."

**Notes:** Sends a verification email. Account cannot log in until email is verified.

---

#### POST /auth/login
Log in and receive a JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "user_password"
}
```

**Response:** `200 OK` - JWT token string

**Error cases:**
- `400` - User not found
- `400` - Invalid password
- `400` - Please verify your email before logging in

---

#### GET /auth/verify?token=UUID
Verify email address from the link in the verification email.

**Response:** `200 OK` - "Email verified successfully. You can now log in."

---

#### POST /auth/resend-verification
Resend verification email.

**Request:**
```json
{ "email": "user@example.com" }
```
---

#### POST /auth/forgot-password
Send password reset email.

**Request:**
```json
{ "email": "user@example.com" }
```

**Response:** Always returns 200 regardless of whether email exists (security best practice).

---

#### POST /auth/reset-password
Reset password using token from email.

**Request:**
```json
{
  "token": "UUID-from-email",
  "newPassword": "anypassword"
}
```
### Users
#### For all requests and responses: Must have bearer token in the authorization header.

---

#### GET /users/me -

Get current logged in user's profile.

**Response:**
```json
{
  "id": 1,
  "name": "Mushfiqur Rahman",
  "email": "user@example.com",
  "canvasBaseUrl": "montclair.instructure.com"
}
```
---

#### PUT /users/me
Update current user's profile.

**Request:**
```json
{
  "name": "New Name",
  "email": "newemail@example.com",
  "canvasBaseUrl": "newuniversity.instructure.com"
}
```
**Notes:** If email is changed, JWT token becomes invalid. Frontend logs user out automatically.

---

#### PUT /users/me/password
Change password.

**Request:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

#### GET /users/me/assignments
Get all assignments for the logged in user.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Research Paper",
    "courseName": "English 101",
    "dueDate": "2026-08-15T23:59:00",
    "points": 100.0,
    "gradeWeight": 25.0,
    "submitted": false
  }
]
```

---

#### PUT /users/me/assignments/{assignmentId}/submit
Mark an assignment as submitted.

---

#### GET /users/me/preferences
Get notification preferences. Creates default preferences if none exist.

**Response:**
```json
{
  "notify72Hours": true,
  "notify24Hours": true,
  "notify4Hours": true
}
```

#### PUT /users/me/preferences
Update notification preferences.

**Request:**
```json
{
  "notify72Hours": true,
  "notify24Hours": false,
  "notify4Hours": true
}
```
### Canvas

#### GET /canvas/sync
Trigger manual sync of Canvas assignments for logged in user.

**Notes:** Requires user to have valid canvasToken and canvasBaseUrl in their profile.

---

#### GET /canvas/courses
Fetch courses directly from Canvas API for logged in user.

---

### Health

#### GET /health
Health check endpoint for UptimeRobot monitoring.

**Response:** `200 OK` - "OK"