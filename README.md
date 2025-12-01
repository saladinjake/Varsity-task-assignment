# Varsity EdTech Platform

A high-performance, industrial-grade learning ecosystem built with React, Node.js, and SQLite.

## Getting Started

### Backend Setup
1. `cd server`
2. `npm install`
3. `npm run seed` (Initializes and seeds the database with YouTube assets)
4. `npm run dev`

### Frontend Setup
1. `cd client`
2. `npm install`
3. `npm run dev`

---

##  System Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Student** | `jane@varsity.com` | `password123` | Portal access, Enrolled course view, Lesson player. |
| **Instructor** | `instructor@varsity.com` | `password123` | Course creation terminal, Student monitoring. |
| **Admin** | `admin@varsity.com` | `password123` | Global system control, Instructor verification, Course expiry. |
| **Pending** | `pending@varsity.com` | `password123` | Instructor account awaiting Admin verification. |

---

##  Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS v4 , Zustand (State), TanStack Query (Caching), Framer Motion (Animations), Lucide-React (Icons).
- **Backend**: Node.js, Express, TypeScript, SQLite3 (Better-sqlite3), JWT, BcryptJS.
- **Tools**: Vite, Nodemon, TS-Node.

---

##  Industrial Features

### 1. Advanced Course Discovery
- **Paginated Explorer**: High-performance "Catalog" at `/courses` supporting large-scale asset discovery (20 items per page by default).
- **Multi-Factor Filtering**: Professional-grade search with category slugs, keywords, and "Free vs. Premium" asset toggles.
- **Dynamic Metadata**: Real-time category injection from the backend database for accurate filtering.

### 2. Live Media Integration
- **YouTube Stream Injection**: Integrated high-performance `iframe` players in both **Course Details** and the **Learning Terminal**.
- **Preview Sessions**: Automatic detection of the first module's preview lesson for authenticated and visitor previews.
- **Locked Content**: Secure logic that gates premium YouTube streams behind enrollment and role-based validation.

### 3. SCORM-Inspired Progress Tracker
- **Automatic Resume**: The system intelligently identifies where a student left off, auto-loading the first uncompleted lesson upon entering the terminal.
- **Sync-Everywhere**: Real-time persistence of "Started" and "Completed" lesson states in the `user_progress` table.
- **Visual Feedback**: Sidebar curriculum navigation with live checkmarks and completion indicators.

### 4. Executive Analytics
- **Real-Time Progress Calculation**: Backend SQL subqueries compute exact completion percentages (e.g., "75% Complete") for every enrolled course on the fly.
- **Visual Progress Guards**: High-fidelity motion progress bars on the user dashboard.
- **Stat Cards**: Industrial-grade dashboard monitoring for Time Invested, Skill Index, and Course Assets.

### 5. Role-Based Access (RBAC)
- **Student Terminal**: Access-restricted learning environment with progress tracking.
- **Instructor Forge**: Dashboard for course management and student monitoring.
- **Admin Control**: Global system oversight, including instructor verification and account management.
 