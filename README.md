# Varsity EdTech Platform

A high-performance, industrial-grade learning ecosystem built with React 18, Node.js, and SQLite — featuring role-based access control, live YouTube media integration, and SCORM-inspired progress tracking.

---

## Project Overview

Varsity is a full-stack EdTech platform that simulates a production-ready course delivery system. It supports three user roles — Student, Instructor, and Admin — each with a dedicated dashboard and scoped access. The platform enables instructors to create and manage courses with YouTube-embedded lesson content, while students can enroll, track progress, and earn certificates.

Built as a monorepo with a React + TypeScript frontend (Vite) and an Express + TypeScript backend (SQLite via `better-sqlite3`), the system demonstrates industrial patterns including TanStack Query caching, Zustand global state, JWT-secured RBAC, and real-time SQL analytics.

---

## Getting Started

### Backend Setup
```bash
cd server
npm install
npm run seed      # Seeds the DB with courses, users, and YouTube assets
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

---

## System Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| Student | `jane@varsity.com` | `password123` | Dashboard, course catalog, lesson player, progress tracker |
| Instructor | `instructor@varsity.com` | `password123` | Course creation, student monitoring, analytics |
| Admin | `admin@varsity.com` | `password123` | Global system control, instructor verification, course expiry |
| Pending | `pending@varsity.com` | `password123` | Awaiting admin verification — restricted access |

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Frontend | React 18, TypeScript, Tailwind CSS v4, Vite |
| State | Zustand (global), TanStack Query (server cache) |
| UI / Motion | Framer Motion, Lucide-React |
| Backend | Node.js, Express, TypeScript |
| Database | SQLite3 via `better-sqlite3` |
| Auth | JWT + BcryptJS |
| Dev Tools | Nodemon, TS-Node, Vitest |

---

## Architecture

```
Varsity-task-assignment/
├── client/               # React 18 + TypeScript SPA (Vite)
│   └── src/
│       ├── pages/        # AdminDashboard, InstructorDashboard, Dashboard,
│       │                 # CourseNavigation, CoursesExplorer, CourseDetails,
│       │                 # Analytics, Certification, Settings, MyAssets
│       ├── components/   # Shared UI components
│       ├── store/        # Zustand slices
│       └── services/     # API service layer (TanStack Query)
└── server/               # Express + TypeScript REST API
    └── src/
        ├── routes/       # course, auth, progress, enrollment routes
        ├── middleware/    # JWT auth, RBAC guards
        ├── db/           # better-sqlite3 connection and schema
        └── __tests__/    # Vitest unit tests
```

---

## Key Features

### 1. Advanced Course Discovery
- Paginated Catalog (`/courses`) — high-performance browsing with 20 items per page, with server-side pagination.
- Multi-Factor Filtering — simultaneous filtering by category, keyword, and Free vs. Premium status.
- Dynamic Metadata — course categories and asset counts are computed live from the database on each request.
- Search Persistence — active filters preserved across page navigations using Zustand.

### 2. Live YouTube Media Integration
- Stream Injection — embedded `iframe` players in both the Course Details preview and the full Learning Player.
- Preview Sessions — the first module's lesson is automatically surfaced for unauthenticated visitors as a teaser.
- Content Gating — premium lesson content is locked behind enrollment checks and JWT role validation.
- Lesson Navigation — module sidebar with sequential lesson links and watched-state indicators.

### 3. SCORM-Inspired Progress Tracking
- Auto-Resume — the platform identifies the last incomplete lesson and redirects the student to pick up where they left off.
- Sync-Everywhere — lesson `Started` and `Completed` states are persisted in real-time to the `user_progress` table.
- Visual Feedback — sidebar navigation renders live checkmarks and a per-module completion percentage.
- Certificate Unlock — a downloadable certificate is issued automatically when all lessons reach `Completed` status.

### 4. Executive Analytics Dashboard
- Real-Time Completion % — SQL subqueries compute exact per-course progress ratios without caching lag.
- Motion Progress Bars — Framer Motion spring-animated bars reflect current completion on every page load.
- Stat Cards — Time Invested, Skill Index, and total Course Assets presented in an at-a-glance summary grid.
- Instructor Analytics — per-course enrollment counts and lesson engagement rates visible in the instructor view.

### 5. Role-Based Access Control (RBAC)
- Student Dashboard — personal learning hub displaying enrolled courses, progress bars, and earned certificates.
- Instructor Dashboard — full course lifecycle management: creation wizard, lesson editor, and student monitoring.
- Admin Control — global oversight of all users, instructor verification workflow, and course expiry management.
- Pending State — newly registered instructors enter a pending queue until explicitly approved by an admin.

---

## Testing

```bash
cd server && npx vitest        # Backend unit tests
cd client && npx vitest        # Frontend component tests
```

---

## Environment Variables

**Server** (`server/.env`):
```env
PORT=5000
JWT_SECRET=your_jwt_secret
```

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000
```

---

Developed as part of the FixNuewYearBug project portfolio. Last updated May 2026.
