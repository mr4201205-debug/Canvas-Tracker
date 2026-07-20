# How to Document - A Simple Guide

## Why We Document
ClassSync uses living documentation, meaning every time a feature is added, modified, or removed, the documentation is updated in the same commit as the code. This ensures that anyone joining the project, including future versions of yourself, can understand exactly how the system works without reading every line of code.
## What Needs Updating and When

```text 
When you add a new feature:

Add a new section to TechnicalDocumentation/FEATURES.md following the existing template
Add any new endpoints to TechnicalDocumentation/API.md
Add any new database columns or tables to TechnicalDocumentation/DATABASE.md
Add any new environment variables to TechnicalDocumentation/DEPLOYMENT.md
Update ARCHITECTURE.md if you added a new service, package, or external dependency

When you modify an existing feature:

Find the relevant section in FEATURES.md and update the flow
If an endpoint changes its request or response format, update API.md
If a database column is added or changed, update DATABASE.md
```

### Example: How Canvas Token Encryption Was Documented
Here is a real example using the AES encryption feature we just added. This shows exactly how to document a change.
```text
What changed:

Canvas tokens were previously stored as plain text in the database. We added AES encryption so tokens are encrypted before saving and decrypted only when needed.
Files changed in code:

service/EncryptionService.java - new class
controller/AuthController.java - inject EncryptionService
controller/UserController.java - encrypt token on save
controller/CanvasController.java - decrypt token before use
service/CanvasSyncService.java - decrypt token before use
application.properties - added encryption.secret
application-secrets.properties - added local encryption key
Render environment variables - added ENCRYPTION_SECRET

What we updated in documentation:
In DATABASE.md under the users table, update the canvas_token row description:
| canvas_token | varchar(255) | AES encrypted Canvas API token (write-only in API) |
In Feat.CanvasSync.md, update the flow to note decryption:
→ Encrypt canvasToken if not null
→ CanvasApiService.getCourses(BaseUrl, Token `decrypted canvas token`)
In DEPLOYMENT.md under Environment Variables, add:
| ENCRYPTION_SECRET | AES key for encrypting Canvas tokens | |
In ARCHITECTURE.md update the services list:
├── service/
│   ├── EncryptionService.java    # AES encrypt/decrypt for sensitive fields
```
## The Golden Rule
```text The Golden Rule
- Does EncryptionService need to be used for any new sensitive field?
- Did I add the feature to FEATURES.md with purpose, files, and flow?
- Did I add new endpoints to API.md?
- Did I add new columns or tables to DATABASE.md?
- Did I add new environment variables to DEPLOYMENT.md?
- Did I update ARCHITECTURE.md if I added a new class or dependency?
- Did I write a unit test for new service logic?
- Did I commit docs alongside the code in the same commit?

```