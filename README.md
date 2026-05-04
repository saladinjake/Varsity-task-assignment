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
- Paginated Catalog (`/courses`) — high-performance browsing with 20 items per page.
- Multi-Factor Filtering — search by category, keyword, and Free vs. Premium toggle.
- Dynamic Metadata — categories injected live from the database.

### 2. Live YouTube Media Integration
- Stream Injection — `iframe` players embedded in Course Details and the Learning Player.
- Preview Sessions — first module's lesson auto-detected for unauthenticated previews.
- Content Gating — premium lessons locked behind enrollment and role validation.

### 3. SCORM-Inspired Progress Tracking
- Auto-Resume — system identifies the last uncompleted lesson and resumes automatically.
- Sync-Everywhere — Started / Completed states persisted in real-time to `user_progress`.
- Visual Feedback — sidebar navigation with live checkmarks and completion indicators.

### 4. Executive Analytics Dashboard
- Real-Time Completion % — SQL subqueries compute exact progress per enrolled course.
- Motion Progress Bars — Framer Motion animated progress indicators.
- Stat Cards — Time Invested, Skill Index, and total Course Assets at a glance.

### 5. Role-Based Access Control (RBAC)
- Student Dashboard — personal learning hub with enrolled courses and certificates.
- Instructor Dashboard — course management, creation wizard, and student monitoring.
- Admin Control — global oversight, instructor verification, and account management.
- Certification — auto-generated certificates on 100% course completion.

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
