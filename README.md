# UniShare Platform (ITPM Project)

UniShare is a student resource-sharing web application built for the ITPM course. It pairs a React single-page application frontend with a Node.js + Express backend using MongoDB (Mongoose). Students can register/login, upload and share PDF resources, search and filter materials, participate in forums, create/attend meetings, take quizzes, bookmark favorites, and report content.

---

## Quick links
- Backend entry: Backend/server.js
- Frontend entry: frontend/src/index.js and frontend/src/App.js
- Uploads: Backend/uploads (served at /uploads)
- Material controller: Backend/controllers/MaterialController.js
- Upload middleware: Backend/middleware/upload.js
- Auth middleware: Backend/middleware/auth.js

---

## Stack & technologies

- Languages: JavaScript (ES6+)
- Backend:
  - Node.js (Express 5)
  - MongoDB via Mongoose
  - File uploads: multer
  - Authentication: JWT (jsonwebtoken)
  - Password hashing: bcryptjs
  - Email: nodemailer
  - PDF parsing: pdf-parse
- Frontend:
  - React (Create React App / react-scripts)
  - React Router DOM
  - Axios for HTTP requests
  - Optional Vite dev script
  - Playwright for end-to-end tests
- Dev tooling:
  - nodemon for backend development
  - @playwright/test and testing-library deps in frontend

---

## High-level architecture

- Browser (React SPA) <-> Express API (backend) <-> MongoDB
- Uploaded files saved to Backend/uploads by multer and served statically at /uploads/<filename>.
- Backend routes are protected by JWT middleware where required; frontend uses a ProtectedRoute wrapper.

ASCII diagram:
[Browser SPA] <--HTTP/JSON--> [Express API (Backend)] <---> [MongoDB]
                                     |
                                     +--> uploads/ (local file storage)
                                     +--> nodemailer (SMTP)

---

## Repository layout (top-level)

- Backend/        # Express API: controllers, routes, models, middleware, uploads
- frontend/       # React SPA
- .gitignore
- .DS_Store

Backend/ (important files)
- server.js — app entry, route registration, static uploads, MongoDB connection
- controllers/ — MaterialController.js, UserController, etc.
- routes/ — MaterialRoutes, UserRoutes, QuizRoute, ForumRoute, MeetingRoute, BookmarkRoute, ReportRoute, FeedbackRoute
- models/ — Material.js, Usermanagement, Report.js, Quiz, Forum.js, Bookmark.js, meeting.js, meetingRegistration.js, Feedback
- middleware/ — auth.js, upload.js, bookmarkAuth.js
- uploads/ — uploaded files (created automatically)
- seeds/ — optional seed scripts

frontend/ (important files)
- src/
  - App.js, index.js
  - pages/ — Home, Library, Quiz, Forum, Meetings (Kuppi), UserManagement pages
  - components/ — Navbar, Footer, ProtectedRoute, etc.
  - services/ — axios API wrappers
- tests/ — Playwright tests
- playwright.config.* — Playwright config

---

## Features

- User registration, login, email verification, password reset
- JWT-based authentication with middleware
- Upload and store PDF materials (uploads stored under Backend/uploads)
- Search, filter, and paginate materials by module, year, tags, and text
- Forum with threads and comments
- Meetings creation and registration
- Quiz endpoints and models
- Bookmarks, reports, and feedback endpoints
- Email notifications via nodemailer (configurable)
- Frontend route protection and page components for all features

---

## Key backend components (summary)

- server.js: registers routes (e.g., /Materials, /User, /Forum, /quiz, /api/meetings, /api/bookmarks, /api/reports, /Feedback), serves uploads static, connects to MongoDB with retry logic.
- Middleware:
  - upload.js: ensures uploads/ exists, stores files to disk, accepts only PDFs, 50 MB max.
  - auth.js: verifies JWT from Authorization header and sets req.userId and req.userRole.
  - bookmarkAuth.js: bookmark-related auth helper.
- Controllers:
  - MaterialController.js: createMaterial (file upload + DB), getMaterials (search/filter/paginate), getMaterialById, deleteMaterial (removes record and file).
  - Other controllers: UserController, QuizController, ForumController, MeetingController, ReportController, Feedback.
- Routes:
  - MaterialRoutes: POST /Materials (upload), GET /Materials, GET /Materials/my/:userId, GET /Materials/:id, DELETE /Materials/:id.
  - UserRoutes: authentication and profile endpoints, notifications, admin checks, dynamic user routes.
  - QuizRoute, ForumRoute, MeetingRoute, BookmarkRoute, ReportRoute, FeedbackRoute for domain functionality.
- Models:
  - Material: user (ObjectId), title, module, year, description, tags, visibility, fileUrl, fileName, fileSize, timestamps.
  - Usermanagement: user schema with hashed passwords, roles, notifications, verification fields.
  - Report, Quiz, Forum, Bookmark, meeting, meetingRegistration, Feedback models.

---

## Key frontend components & pages

- Routing defined in frontend/src/App.js with public (login/register/forgot/reset) and protected routes (home, dashboard, library, upload, quiz, forum, profile, admin).
- ProtectedRoute component guards pages that require authentication.
- Pages include UI for uploading PDFs, viewing library and filters, material detail views, forum threads, meeting pages, and user account management.
- services/ contains API wrappers using axios (handles attaching JWT tokens and calling backend endpoints).

---

## Representative API examples

Material upload (multipart/form-data)
```bash
curl -X POST "http://localhost:5000/Materials" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -F "file=@/path/to/file.pdf" \
  -F "userId=<USER_ID>" \
  -F "title=Data Structures Notes" \
  -F "module=DS" \
  -F "year=Year2" \
  -F "description=Lecture notes" \
  -F "tags=[\"trees\",\"graphs\"]" \
  -F "visibility=public"
