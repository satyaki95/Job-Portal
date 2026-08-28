# Job Portal Project Report

**Project:** Job Portal
**Report date:** 27 August 2026
**Repository:** `d:/Coding/Job-Portal`
**Report scope:** Current source code and checked-in configuration

## 1. Executive Summary

Job Portal is a full-stack employment marketplace focused on trade and apprenticeship-oriented opportunities. The application connects candidates with employers through public job discovery, candidate profiles and resumes, saved jobs, job applications, employer job management, applicant review, and administrative moderation.

The project is implemented as two independently runnable applications:

- `frontend/`: React and Vite single-page application
- `backend/`: Node.js and Express REST API backed by MongoDB

The product has three primary roles:

- **Candidate (`user`)**: searches for jobs, maintains a profile, uploads a resume, saves jobs, and applies for jobs.
- **Employer (`employer`)**: creates and manages jobs, maintains an employer profile, and reviews applications after approval.
- **Administrator (`admin`)**: monitors platform activity, manages users and employer approval, and moderates jobs.

The main implementation is functional and has a clear separation between route modules, controllers, Mongoose models, and frontend pages. However, the current source also contains several production-blocking security and integrity issues. The highest-priority issue is that registration accepts a client-supplied `admin` role, which can allow anyone to create an administrator account. Credentials present in the repository or environment configuration should also be rotated and removed from version control immediately.

## 2. Product Objectives and Features

### 2.1 Candidate features

- Account registration and email verification using an OTP
- Login and JWT-based authenticated sessions
- Forgot-password and reset-password workflows using OTPs
- Candidate profile management
- Trade skills and certification details
- Resume upload and resume viewing
- Public job browsing and job-detail pages
- Search and job filtering
- Saving and unsaving jobs
- Applying for jobs
- Viewing submitted applications and their statuses

### 2.2 Employer features

- Employer registration
- Email verification
- Admin approval workflow
- Employer profile and organization information
- Job creation with optional company-logo upload
- Listing, editing, closing, and deleting owned jobs
- Employer dashboard statistics
- Applicant list per job
- Applicant status updates: pending, accepted, or rejected

### 2.3 Administrator features

- Dedicated admin login and dashboard
- Platform overview statistics
- User and employer listing
- Employer approval or rejection
- User deletion
- Job moderation and fraudulent-job removal
- Job and applicant administration

### 2.4 Public features

- Home page and navigation
- Job search and public job details
- Contact or inquiry form
- API health response at `/`

## 3. Technology Stack

### Frontend

- React `19.2.8`
- Vite `8.2.0`
- React Router DOM `7.18.2`
- Axios `1.19.0`
- Tailwind CSS `4.3.3`
- Lucide React and React Icons
- DotLottie React for animation assets
- ESLint `10.8.0`

### Backend

- Node.js with ECMAScript modules
- Express `5.2.1`
- Mongoose `9.8.1`
- MongoDB, configured for an Atlas connection
- JSON Web Tokens via `jsonwebtoken`
- Password hashing via `bcryptjs`
- File handling via `multer`
- Cloudinary for uploaded media
- Brevo API package and `fetch`-based email delivery
- Nodemon for local development

### Hosting and deployment

- Vercel configuration exists for both applications.
- The frontend is built with Vite and is configured as a client-side SPA.
- The backend is configured with `@vercel/node`, but its current `app.listen()` pattern and deployment metadata should be reviewed before production use.

## 4. Architecture

### 4.1 Backend architecture

The backend follows a conventional Express MVC-like structure:

1. `server.js` loads environment variables, creates the Express application, connects to MongoDB, registers middleware, and mounts route modules.
2. Route files define HTTP methods, URL paths, authentication, and authorization middleware.
3. Controllers contain request handling and business logic.
4. Mongoose models define persistence schemas and references.
5. Utility modules handle Cloudinary uploads and email delivery.

The API is mounted under `/api`:

- `/api/auth`
- `/api/user`
- `/api/job`
- `/api/application`
- `/api/saved`
- `/api/inquiry`
- `/api/employer`
- `/api/admin`

The authentication middleware reads a Bearer token from the `Authorization` header, verifies it with `JWT_SECRET`, and stores the decoded payload in `req.user`. The `authorize()` middleware then checks whether the decoded role is allowed for a route.

### 4.2 Frontend architecture

The frontend is a React single-page application. `frontend/src/App.jsx` defines route-to-page mappings. Page components compose reusable components for navigation, dashboards, forms, job listings, applicant views, and profile workflows.

The Axios client in `frontend/src/utils/api.js` creates an API client using `VITE_BASE_URL` and attaches the token stored in `jobportal_user` to outgoing requests.

The frontend is organized into:

- `src/pages/`: route-level page wrappers
- `src/components/`: reusable UI and workflow components
- `src/pages/admin/` and `src/components/admin/`: admin workflows
- `src/pages/employer/` and `src/components/employer/`: employer workflows
- `src/utils/`: API and supporting utilities
- `src/assets/`: static data and style-related assets

There are no complete frontend route guards. Backend authorization is therefore the primary security boundary, while direct navigation to protected frontend paths may render before an API request fails.

## 5. User Workflows

### 5.1 Candidate registration and application workflow

1. A visitor registers through the signup page.
2. The backend creates a user and sends an email verification OTP.
3. The user verifies the email address.
4. The user logs in and receives a JWT.
5. The candidate completes profile information and uploads a resume.
6. The candidate browses jobs, applies, or saves jobs.
7. The candidate views application history and status changes.

### 5.2 Employer workflow

1. An employer registers and verifies the email address.
2. The account remains subject to administrator approval.
3. An approved employer accesses the employer dashboard.
4. The employer creates jobs with structured details and an optional company logo.
5. The employer edits, closes, or deletes owned jobs.
6. The employer reviews applicants and updates application statuses.

### 5.3 Administrator workflow

1. An administrator signs in through the admin login page.
2. The dashboard displays platform statistics and jobs.
3. The administrator reviews employers and changes approval status.
4. The administrator manages users and removes inappropriate accounts or jobs.
5. The administrator can inspect applicants and application statuses.

## 6. Frontend Route Catalog

| Route | Page or workflow |
|---|---|
| `/` | Home page |
| `/jobs` | Job search, filters, pagination, save/apply actions |
| `/jobdetails/:id` | Job details and application actions |
| `/login` | Login, forgot password, and reset password |
| `/signup` | Candidate or employer registration and verification |
| `/viewprofile` | Candidate profile and resume management |
| `/saved` | Saved jobs |
| `/applications` | Candidate application history |
| `/contact` | Contact/inquiry form |
| `/admin/login` | Administrator login |
| `/admin` | Administrator dashboard |
| `/admin/list/jobs` | Administrator job management |
| `/admin/applicants` | Administrator applicant management |
| `/admin/manage` | User, employer, and moderation management |
| `/employer` | Employer dashboard |
| `/employer/addjobs` | Employer job creation |
| `/employer/list/jobs` | Employer-owned job management |
| `/employer/applicants` | Employer applicant management |

The route file currently contains duplicate wildcard routes that render `null`. Footer links also reference `/companies` and `/roles`, which are not defined in the current route table.

## 7. Backend API Catalog

Base URL: `/api`

### Authentication

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Create an account and send verification OTP |
| POST | `/auth/verify-email` | Public | Verify an email using OTP |
| POST | `/auth/login` | Public | Authenticate and issue a JWT |
| POST | `/auth/forgot-password` | Public | Generate a password-reset OTP |
| POST | `/auth/reset-password` | Public | Reset a password using OTP |

### Candidate and user resources

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/user/profile` | JWT | Read the authenticated profile |
| PUT | `/user/profile` | JWT, user | Update candidate profile and optionally upload resume |
| GET | `/user/resume/:id` | Public | Redirect to a stored resume URL |
| GET | `/saved` | JWT | List saved jobs |
| POST | `/saved/job/:jobId` | JWT | Toggle a saved job |
| POST | `/application/apply/:jobId` | JWT | Submit an application |
| GET | `/application/user` | JWT | List the current user's applications |

### Jobs

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/job` | JWT, admin/employer | Create a job |
| GET | `/job` | Public | List jobs using search and filters |
| GET | `/job/:id` | Public | Read one job |
| PUT | `/job/:id` | JWT, admin/employer | Update a job |
| DELETE | `/job/:id` | JWT, admin/employer | Delete a job and related applications |
| PATCH | `/job/:id/close` | JWT, admin/employer | Close a job |
| GET | `/job/admin/stats` | JWT, admin/employer | Read admin or employer statistics |
| GET | `/job/admin/jobs` | JWT, admin/employer | List all or owned jobs for dashboards |
| GET | `/application/:id/applicants` | JWT, admin/employer | List applicants for a job |
| PATCH | `/application/:id/status` | JWT, admin/employer | Change application status |

### Employer resources

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/employer/dashboard` | JWT, employer | Read employer dashboard data |
| POST | `/employer/jobs` | JWT, employer | Create an employer-owned job |
| GET | `/employer/jobs` | JWT, employer | List employer-owned jobs |
| PUT | `/employer/jobs/:id` | JWT, employer | Update an owned job |
| DELETE | `/employer/jobs/:id` | JWT, employer | Delete an owned job |
| PATCH | `/employer/jobs/:id/close` | JWT, employer | Close an owned job |
| GET | `/employer/jobs/:jobId/applicants` | JWT, employer | List applicants for an owned job |
| PATCH | `/employer/applications/:applicationId/status` | JWT, employer | Update an owned-job application |
| GET | `/employer/profile` | JWT, employer | Read employer profile |
| PUT | `/employer/profile` | JWT, employer | Update employer profile |

### Administrator and inquiries

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/admin/overview` | JWT, admin | Read platform statistics |
| GET | `/admin/users` | JWT, admin | List users and employers |
| PATCH | `/admin/employers/:userId/status` | JWT, admin | Approve or reject an employer |
| DELETE | `/admin/users/:userId` | JWT, admin | Delete a user and employer-related jobs |
| DELETE | `/admin/jobs/:jobId` | JWT, admin | Remove a moderated job |
| POST | `/inquiry` | Public | Store a contact inquiry and attempt email notification |

## 8. Data Model

### User

The `User` document contains identity and account fields including `name`, unique `email`, hashed `password`, `phone`, `tradeSkills`, `certificationDetails`, and `role`. It also stores employer approval status, resume URL and public ID, saved job references, verification fields, password-reset fields, and timestamps.

Roles are constrained by the schema to `user`, `employer`, and `admin`. Employer status is constrained to `pending`, `approved`, or `rejected`.

### Employer

The `Employer` document stores a user reference, organization name, logo, description, and timestamps. The current schema does not declare a `website` field even though employer profile update logic attempts to handle one.

### Job

A job includes:

- Company logo
- Role and company name
- Technology stack
- Location and experience
- Numeric salary and salary type
- Job type and category
- Post date and number of openings
- Overview, responsibilities, criteria, and education
- Creating user reference
- Active/closed status
- Timestamps

### Application

An application references a `Job` and a `User`. Its status is constrained to `pending`, `accepted`, or `rejected`, with timestamps for auditing and display.

### Inquiry

An inquiry stores contact name, email, phone, subject, message, a status of `pending`, `contacted`, or `closed`, and timestamps.

## 9. External Services and File Handling

### MongoDB

The database connection reads `MONGODB_URI` and appends `/Job` as the database name. Connection setup is in `backend/config/db.js`.

### Cloudinary

Cloudinary credentials are read from environment variables. Logos and resumes are uploaded into separate logical folders:

- `jobportal/logos`
- `jobportal/resumes`

Multer uses memory storage before the file is sent to Cloudinary.

### Email

Brevo is used to send verification, password-reset, and inquiry-related messages. The email service reads `BREVO_API_KEY` and `EMAIL_USER`.

The inquiry controller currently invokes the email helper with positional arguments even though the helper expects a single object, so inquiry persistence may work while notification content is incorrect.

## 10. Configuration and Environment Variables

Expected configuration includes:

| Variable | Use |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing and verification |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `BREVO_API_KEY` | Brevo email API authentication |
| `EMAIL_USER` | Sender email address |
| `VITE_BASE_URL` | Frontend API host |

Any live-looking credentials in checked-in environment files must be considered exposed. They should be revoked, rotated, removed from git history where appropriate, and replaced with environment-specific secret storage.

## 11. Local Setup and Operation

### Backend

```bash
cd backend
npm install
npm start
```

The current start script runs Nodemon and the server listens on port `5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Useful frontend commands:

```bash
npm run build
npm run lint
npm run preview
```

The frontend API client expects `VITE_BASE_URL` to point to the backend host.

## 12. Deployment Notes

The backend Vercel configuration routes all requests to `server.js` using `@vercel/node`. It also references `dist/**` in its included files, although the Vite build output belongs to the separate frontend project. The backend still calls `app.listen(5000)`, which should be reviewed for the target Vercel execution model.

The frontend Vercel configuration rewrites all requests to `/`, supporting client-side routing. Production deployment should verify that:

- The frontend build output is correctly configured for the selected Vercel project.
- All required environment variables are configured in Vercel.
- Backend CORS is restricted to the production frontend origin.
- API health, authentication, uploads, email delivery, and SPA deep links work after deployment.

## 13. Security and Reliability Findings

The following findings are visible in the current implementation and should be addressed before production use.

### Critical

1. **Public administrator registration:** registration accepts a client-provided role, including `admin`. Administrator accounts should be provisioned through a controlled process, seed script, or existing-admin approval flow; public registration should only create candidates or approved employer-pending accounts.
2. **Exposed credentials:** live-looking database, email, JWT, and Cloudinary values appear in environment configuration. Rotate all affected credentials immediately and remove secrets from source control.
3. **Public resume retrieval:** `GET /user/resume/:id` is unauthenticated and can expose any stored resume when an ID is known. Resume access should require authorization and should preferably use short-lived signed URLs.

### High

4. **Application business rules are incomplete:** application logic does not consistently require the `user` role, reject applications for closed jobs, or prevent duplicate applications.
5. **Closed jobs remain publicly readable:** job listing/detail logic should consistently filter closed jobs where the product intends them to be hidden.
6. **Authorization must be checked at the object level:** every employer read, update, delete, close, and applicant-status operation must verify that the target job belongs to the authenticated employer.
7. **Uploads lack strong validation:** enforce file size, MIME type, extension, and content restrictions separately for resumes and logos. Do not treat arbitrary uploaded files as safe.
8. **No rate limiting:** login, registration, OTP verification, and password-reset endpoints are vulnerable to brute-force and abuse attempts.

### Medium

9. **OTP security:** OTP generation uses `Math.random()` and OTP values are stored in plaintext. Use cryptographically secure random values, store hashes, expire aggressively, and limit attempts.
10. **Account enumeration:** authentication and password-reset responses can reveal whether an email exists. Use consistent external responses where practical.
11. **Input validation:** add schema validation for request bodies, query parameters, identifiers, strings, arrays, numeric ranges, and maximum lengths.
12. **Regex abuse risk:** user-provided search strings are converted into MongoDB regular expressions without sufficient normalization or bounded-query protection.
13. **Deletion cleanup:** deleting users or jobs does not consistently clean applications, saved-job references, employer records, or uploaded Cloudinary assets.
14. **Connection error handling:** database connection setup should expose startup failures clearly and avoid accepting traffic when the database is unavailable.
15. **Authentication storage inconsistency:** different parts of the frontend use `jobportal_user` and `user`, which can lead to incorrect role or token state.
16. **Broken or stale frontend paths:** `/companies`, `/roles`, and legacy saved-question calls do not have corresponding current backend/frontend implementations.

## 14. Testing and Quality Status

No automated test suite was found in the inspected repository. The project should add at least:

- Controller and utility unit tests
- Authentication and authorization tests
- Job ownership tests
- Application lifecycle tests
- Upload validation tests
- API integration tests against a test MongoDB database
- Frontend tests for login, registration, application, save, and employer workflows
- Deployment smoke tests for SPA routes and API connectivity

The existing frontend scripts provide `lint` and `build`, but these are not substitutes for behavioral tests or security regression tests.

At report time, `cd frontend && npm run lint` executes but fails with 32 errors and 5 warnings across the existing frontend source. Reported categories include unused variables, empty catch blocks, React effect/state-pattern violations, missing hook dependencies, and an undefined identifier. This is a baseline quality issue to resolve before treating the frontend as release-ready.

## 15. Recommended Roadmap

### Phase 1: Production safety

1. Rotate all exposed credentials and remove them from repository history where required.
2. Prevent public admin registration.
3. Protect resume access with authenticated authorization and signed URLs.
4. Enforce candidate-only application creation, active-job checks, ownership checks, and duplicate-application prevention.
5. Add request validation, upload restrictions, rate limiting, and secure security headers.
6. Restrict CORS to known frontend origins.

### Phase 2: Correctness and maintainability

1. Fix the inquiry email argument contract.
2. Add the missing employer `website` schema field or remove unsupported update behavior.
3. Normalize frontend authentication state into one storage and API mechanism.
4. Clean up stale routes and legacy saved-question code.
5. Implement consistent deletion cleanup and Cloudinary asset cleanup.
6. Remove generated build artifacts from source control unless they are intentionally deployed that way.

### Phase 3: Product maturity

1. Add pagination and indexes for common job, application, and user queries.
2. Add audit logging for admin moderation and employer status changes.
3. Add notifications for application status changes and employer approval.
4. Add employer organization verification and richer company profiles.
5. Improve candidate discovery with stronger search, category filters, and saved-search support.
6. Establish CI checks for linting, builds, tests, dependency auditing, and secret scanning.

## 16. Conclusion

Job Portal has a solid feature foundation for a multi-role job marketplace. Its module structure is understandable, the main workflows are represented in both the frontend and backend, and the data model covers the central marketplace entities.

The application should be treated as a development or pre-production system until the authorization, credential, resume privacy, upload, validation, and rate-limiting findings are resolved. Once those controls are in place, automated tests and deployment checks will provide the confidence needed to extend the platform safely.
