# Environment Variables & Deployment

## Architecture
- **Backend:** Docker container on Render
- **Frontend:** Static site on Netlify
- **Database:** PostgreSQL on Render

## Environment Variables

### Backend (set in Render dashboard)
| Variable | Description | Example                  |
|----------|-------------|--------------------------|
| SPRING_DATASOURCE_URL | Internal Render DB URL | jdbc:postgresql://host/db |
| SPRING_DATASOURCE_USERNAME | DB username |                          |
| SPRING_DATASOURCE_PASSWORD | DB password | strongpassword           |
| SPRING_MAIL_USERNAME | Gmail address (legacy) | -                        |
| SPRING_MAIL_PASSWORD | Gmail app password (legacy) | -                        |
| RESEND_API_KEY | Resend API key | re_xxx                   |
| JWT_SECRET | Secret for signing tokens | long-random-string       |
| CANVAS_API_TOKEN | Personal Canvas token |                          |
| CANVAS_API_BASE_URL | Canvas base URL | montclair.instructure.com |
| ENCRYPTION_SECRET | AES key for encrypting Canvas tokens |                          |

### Frontend (set in Netlify dashboard or .env.local locally)
| Variable | Description |
|----------|-------------|
| None required | API URL is auto-detected based on hostname in api.js |

## Local Development Setup

### Prerequisites
- Java 21
- Maven
- Node.js 18+
- PostgreSQL 16
- IntelliJ IDEA
- VS Code

### Backend Setup
1. Clone repo: `git clone https://github.com/mr4201205-debug/Canvas-Tracker`
2. Open `canvas-tracker` folder in IntelliJ
3. Create `src/main/resources/application-secrets.properties` with local values
4. Run `CanvasTrackerApplication.java`
5. Backend runs at `http://localhost:8080`

### Frontend Setup
1. Open `class-sync-frontend` folder in VS Code
2. Run `npm install`
3. Run `npm start`
4. Frontend runs at `http://localhost:3000`

### application-secrets.properties (local only, never commit; add this to .gitignore)
```properties
spring.datasource.password=
spring.mail.username=
spring.mail.password=
jwt.secret=
canvas.api.token=
canvas.api.baseUrl=
resend.api.key=
```

## Deploying Backend Changes
1. Make changes locally and test
2. `git add . && git commit -m "description" && git push`
3. Render automatically detects push and rebuilds Docker container
4. Monitor deployment in Render dashboard under Events tab
5. Check logs for any startup errors

## Deploying Frontend Changes
1. Make changes locally and test at localhost:3000
2. `git add . && git commit -m "description" && git push`
3. Netlify automatically detects push and rebuilds
4. Live in 1-2 minutes at classsync33.netlify.app

## Monitoring
- **UptimeRobot:** Pings `https://canvas-tracker.onrender.com/health` every 5 minutes
- **Render logs:** View in Render dashboard, useful for debugging email and sync issues
- **Netlify logs:** View in Netlify dashboard for frontend build errors