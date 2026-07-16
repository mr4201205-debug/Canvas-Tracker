# System Design, Tech Stack & diagrams
## System Overview

ClassSync is a full-stack web application that tracks Canvas LMS assignments and sends personalized email reminders to students before deadlines.

## Tech Stack

### Backend
- **Language:** Java 21
- **Framework:** Spring Boot 4
- **Database ORM:** Spring Data JPA with Hibernate
- **Security:** Spring Security with JWT authentication
- **Email:** Resend API via OkHttp
- **Canvas Integration:** WebClient (Spring WebFlux)
- **Build Tool:** Maven
- **Containerization:** Docker
- **Hosting:** Render

### Frontend
- **Framework:** React 18
- **HTTP Client:** Axios
- **Routing:** React Router DOM
- **Hosting:** Netlify

### Database
- **Engine:** PostgreSQL 16
- **Hosting:** Render (production), localhost (development)

### Infrastructure
- **Backend Hosting:** Render (Docker container)
- **Frontend Hosting:** Netlify
- **Email Service:** Resend
- **Uptime Monitoring:** UptimeRobot

## System Architecture

```mermaid
Flowchart TD
    A["React Frontend - Netlify"] -->|HTTPS + REST API| B["Spring Boot API - Render"]

    B --> C["Spring Security + JWT Authentication"]

    C --> D["Controllers"]
    D --> E["Services"]
    E --> F["Repositories"]
    F --> G[("PostgreSQL - Render")]

    B --> H["Resend API - Email Notifications"]
    B --> I["Canvas LMS API"]

    G --> G1["users"]
    G --> G2["assignments"]
    G --> G3["notification_preferences"]
```
## 📂 Package Structure

```text
com.canvastracker.canvas_tracker/
├── controller/
│   ├── AuthController.java        # Authentication endpoints (Register, login, reset password)
│   ├── UserController.java        # User profiles, customized assignments, and configurations
│   ├── AssignmentController.java  # Exposes CRUD endpoints for local assignment data
│   ├── CanvasController.java      # Proxies Canvas API requests and forces manual data syncs
│   └── HealthController.java      # Lightweight ping endpoint for deployment uptime monitoring
│
├── service/
│   ├── UserService.java           # Orchestrates core account actions and profile alterations
│   ├── AssignmentService.java     # Manages the logical lifecycle of student course tasks
│   ├── CanvasApiService.java      # Dispatches direct outbound HTTP requests to Canvas endpoints
│   ├── CanvasSyncService.java     # Processes raw payloads pulled from Canvas to sync records
│   ├── NotificationService.java   # Evaluates active task parameters to identify due reminders
│   └── EmailService.java          # Handles final email generation and distribution via Resend
│
├── repository/
│   ├── UserRepository.java        # Data interface mapping user entity CRUD parameters
│   ├── AssignmentRepository.java  # Data interface for querying localized task tables
│   └── NotificationPreferenceRepository.java # Data interface for student messaging rules
│
├── model/
│   ├── User.java                  # Relational object reflecting database user criteria
│   ├── Assignment.java            # Relational object capturing assignment metadata
│   └── NotificationPreference.java # Relational object holding course contact rules
│
├── security/
│   ├── JwtService.java            # Governs cryptographic token generation and extraction
│   ├── JwtFilter.java             # Request filter intercepting headers for active validation
│   ├── SecurityConfig.java        # Definitively sets application pathway firewall patterns
│   └── CorsConfig.java            # Grants specific cross-origin domain handshake limits
│
└── scheduler/
    └── CanvasScheduler.java       # Orchestrates hourly backend cron synchronization sweeps
```
