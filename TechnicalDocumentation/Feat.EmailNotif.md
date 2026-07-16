## Feature: Email Notifications

### Purpose
Send personalized email reminders to students at 72, 24, and 4 hours before assignment due dates. Respects per-user notification preferences. Prevents spam by only sending once per 23 hour window.

### Backend Classes
- `NotificationService.java` - `checkAndNotify()`
- `EmailService.java` - `sendNotificationEmail()`
- `AssignmentRepository.java` - reads all assignments
- `NotificationPreferenceRepository.java` - reads user preferences
- `CanvasScheduler.java` - triggers every hour

### Database Tables
- `assignments` - reads `due_date`, `submitted`, `last_notified_at`; writes `last_notified_at`
- `notification_preferences` - reads `notify72_hours`, `notify24_hours`, `notify4_hours`

### Logic Flow
CanvasScheduler (every hour)

→ NotificationService.checkAndNotify()

→ AssignmentRepository.findAll()

→ For each assignment:

→ Skip if submitted=true

→ Skip if due_date is null

→ Calculate hoursUntilDue

→ Skip if hoursUntilDue < 0 (already past due)

→ Check lastNotifiedAt: skip if notified within 23 hours

→ Load NotificationPreference for user

→ If hoursUntilDue <= 4 AND notify4Hours=true → send urgent email

→ If hoursUntilDue <= 24 AND notify24Hours=true → send 24hr email

→ If hoursUntilDue <= 72 AND notify72Hours=true → send 72hr email

→ Update lastNotifiedAt = now

→ Save assignment

### How to Extend
To add Discord notifications:
1. Add `discordWebhook` field to `User.java`
2. Add `notifyDiscord` field to `NotificationPreference.java`
3. Create `DiscordService.java` that POSTs to the webhook URL
4. In `NotificationService.checkAndNotify()` call `discordService.send()` alongside email

---