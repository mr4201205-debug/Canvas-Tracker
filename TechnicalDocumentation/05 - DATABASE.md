# All Tables, Columns & Relationships

## Connection
- **Production:** Render PostgreSQL (internal URL in environment variables)
- **Local:** `jdbc:postgresql://localhost:5432/canvas_tracker`

## Tables -

### users
```mermaid
Column                | Type         | Description
id                    | bigint (PK)  | Auto-generated unique identifier
canvas_base_url       | varchar(255) | e.g. montclair.instructure.com
canvas_token          | varchar(255) | Canvas API access token (write-only in API)
email                 | varchar(255) | Login email, must be unique
name                  | varchar(255) | Student's full name 
password              | varchar(255) | BCrypt hashed password
verification_token    | varchar(255) | UUID for email verification link
is_verified           | boolean      | Email verification status, default false
password_reset_expiry | timestamp    | No timezone
password_reset_token  | varchar(255) | Expires 1 hour after generation
```
### assignments
```mermaid
Column           | Type         | Description
id               | bigint (PK)  | Auto-generated unique identifier
course_name      | varchar(255) | Course name from Canvas
due_date         | timestamp    | Assignment due date and time (No timezone)
grade_weight     | double       | Percentage of final grade (nullable)
points           | double       | Total points possible 
submitted        | boolean      | Whether student submitted, default false
user_id          | bigint (FK)  | References users.id, many-to-one
last_notified_at | timestamp    | When last reminder was sent (nullable)
```
### notification_preferences
```mermaid
Column         | Type        | Description
notify24_hours | boolean     | Send 24 hour reminder, default true
notify4_hours  | boolean     | Send 4 hour reminder, default true
notify72_hours | boolean     | Send 72 hour reminder, default true
user_id        | bigint (FK) | References users.id, one-to-one
```
## Relationships
One user can have many assignments.   
One user can only have one notification preferences.

