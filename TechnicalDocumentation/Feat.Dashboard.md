## Feature: Dashboard and Assignment Display

### Purpose
Show students their upcoming and overdue assignments with countdown timers.

### Frontend Files
- `src/Pages/Dashboard.js` - Main dashboard component
- `src/Services/api.js` - `assignmentService.getMyAssignments()`

### Backend Classes
- `UserController.java` - `GET /users/me/assignments`
- `AssignmentService.java` - `getAssignmentsByUser()`
- `AssignmentRepository.java` - `findByUserId()`

### Database Tables
- `assignments` - reads all rows for user

### Request Flow
Dashboard.js mounts (useEffect)

→ assignmentService.getMyAssignments()

→ GET /users/me/assignments

→ UserController.getMyAssignments()

→ authentication.getName() → gets email from JWT

→ UserRepository.findByEmail(email)

→ AssignmentService.getAssignmentsByUser(user.getId())

→ AssignmentRepository.findByUserId(userId)

→ Returns List<Assignment>

→ Dashboard.js filters into upcomingAssignments and overdueAssignments

→ Renders assignment cards with countdown

### How to Extend
To add sorting by due date:
- Frontend: `upcomingAssignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))`
- Backend: Change `findByUserId` to `findByUserIdOrderByDueDateAsc` in `AssignmentRepository`

To add filtering by course:
- Add a course filter dropdown in `Dashboard.js`
- Filter the assignments array: `assignments.filter(a => a.courseName === selectedCourse)`

---