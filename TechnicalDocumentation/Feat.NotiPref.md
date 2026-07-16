## Feature: Notification Preferences

### Purpose
Allow students to control which reminder emails they receive per account.

### Frontend Files
- `src/Pages/Settings.js` - Toggle switches for each preference

### Backend Classes
- `UserController.java` - `GET /users/me/preferences`, `PUT /users/me/preferences`
- `NotificationPreferenceRepository.java` - `findByUserId()`

### Database Tables
- `notification_preferences` - reads and writes all three boolean columns

### Request Flow (Load preferences)
Settings.js (useEffect on mount)

→ userService.getPreferences()

→ GET /users/me/preferences

→ UserController.getPreferences()

→ authentication.getName() → email → user

→ NotificationPreferenceRepository.findByUserId(user.getId())

→ If not found: create default preferences with all true, save, return

→ Return preferences JSON

→ Settings.js sets toggle states

### Request Flow (Save preferences)
Settings.js (Save Preferences button)

→ userService.updatePreferences(notify72, notify24, notify4)

→ PUT /users/me/preferences

→ UserController.updatePreferences()

→ Find or create preferences for user

→ Update all three boolean values

→ Save

→ Return 200 "Preferences updated successfully"

---
