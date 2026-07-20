# Project Overview & Setup Instructions
### ClassSync is a smart Canvas assignment tracker that sends personalized email reminders to students before deadlines.

## What it does
ClassSync connects to your Canvas account and automatically sends email reminders at 72 hours, 24 hours, and 4 hours before assignments are due. You can customize which reminders you receive and mark assignments as submitted to stop getting reminders for them.

## Live App

**Frontend:** https://classsync33.netlify.app  
**Backend API:** https://canvas-tracker.onrender.com

## Features

- Email verification on registration
- JWT authenticated sessions
- Canvas LMS integration via API
- Automatic hourly sync of upcoming assignments
- Customizable notification preferences per user
- Mark assignments as submitted
- Forgot password and reset password via email
- Robust data protection: Passwords securely hashed and Canvas LMS integration tokens fully encrypted before database storage.

## Tech Stack

- **Backend:** Java 21, Spring Boot 4, Spring Security, PostgreSQL
- **Frontend:** React 18, React Router, Axios
- **Email:** Resend API
- **Hosting:** Render (backend), Netlify (frontend), Supabase (database)

## Documentation

Full technical documentation is in the `TechnicalDocumentation` folder:

- [Architecture](02%20-%20ARCHITECTURE.md)
- [API Reference](03%20-%20API.md)
- [Database Schema](05%20-%20DATABASE.md)
- [Feature Flows](04%20-%20FEATURES.md)
- [Deployment Guide](06%20-%20DEPLOYMENT.md)
- [Contributing Guide](07%20-%20CONTRIBUTING.md)

## Local Setup

See [DEPLOYMENT.md ](06%20-%20DEPLOYMENT.md)for full local setup instructions.


