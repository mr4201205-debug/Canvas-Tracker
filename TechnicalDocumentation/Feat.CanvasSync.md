## Feature: Canvas Sync

### Purpose
Automatically fetch upcoming assignments from Canvas and save them to the ClassSync database.

### Frontend Files
- `src/Pages/Courses.js` - Sync Canvas Assignments button
- `src/Services/api.js` - `canvasService.syncAssignments()`

### Backend Classes
- `CanvasController.java` - `GET /canvas/sync`
- `CanvasSyncService.java` - `syncAssignments(userId)`
- `CanvasApiService.java` - `getCourses()`, `getAssignments()`
- `AssignmentRepository.java` - `save()`, `findByUserId()`
- `CanvasScheduler.java` - Runs automatically every hour

### Database Tables
- `users` - reads `canvas_token`, `canvas_base_url`
- `assignments` - inserts new rows

### Request Flow (Manual Sync)
Courses.js (Sync button click)

→ canvasService.syncAssignments()

→ GET /canvas/sync

→ CanvasController.syncAssignments()

→ authentication.getName() → email → user

→ CanvasSyncService.syncAssignments(user.getId())

→ Check user has canvasToken and canvasBaseUrl (skip if null)

→ Encrypt canvasToken if not null

→ CanvasApiService.getCourses(BaseUrl, Token `decrypted canvas token`)

→ GET https://{canvasBaseUrl}/api/v1/courses?enrollment_state=active

→ Returns JSON string of courses

→ For each course:

→ CanvasApiService.getAssignments(canvasBaseUrl, canvasToken, courseId)

→ For each assignment:

→ Skip if no due_at

→ Skip if due_at is in the past

→ Skip if already exists in database

→ Save new Assignment to database

→ Return "Sync completed successfully"

### Request Flow (Automatic Sync)
CanvasScheduler (every hour)

→ syncAndNotify()

→ UserRepository.findAll()

→ For each user: CanvasSyncService.syncAssignments(user.getId())

→ NotificationService.checkAndNotify()

### How to Extend
To update due dates when Canvas changes them:
In `CanvasSyncService.syncAssignments()` instead of skipping existing assignments, find them and update the due date:
```txt
Optional<Assignment> existing = assignmentRepository.findByUserId(userId)
    .stream()
    .filter(a -> a.getTitle().equals(title) && a.getCourseName().equals(courseName))
    .findFirst();

if (existing.isPresent()) {
    existing.get().setDueDate(newDueDate);
    assignmentRepository.save(existing.get());
} else {
    // save new assignment
}
```

---
