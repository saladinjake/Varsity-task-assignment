import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (db) return db;

  db = await open({
    filename: path.join(__dirname, '../../database.sqlite'),
    driver: sqlite3.Database
  });

  await setupTables(db);
  return db;
}

export async function setupTables(db: Database) {
  // Users Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student', -- student, instructor, admin
      avatar TEXT,
      bio TEXT,
      is_verified BOOLEAN DEFAULT 0,
      is_disabled BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Categories Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL
    )
  `);

  // Courses Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      instructor_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      subtitle TEXT,
      description TEXT,
      thumbnail TEXT,
      price REAL DEFAULT 0,
      is_published BOOLEAN DEFAULT 0,
      is_expired BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (instructor_id) REFERENCES users(id),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);

  // Modules Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS modules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    )
  `);

  // Lessons Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module_id INTEGER,
      course_id INTEGER, -- Keep for legacy or easy lookups
      title TEXT NOT NULL,
      video_url TEXT,
      content TEXT,
      duration INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      is_preview BOOLEAN DEFAULT 0,
      FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    )
  `);

  // Enrollments Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      payment_method TEXT, -- stripe, paystack
      payment_id TEXT,
      progress REAL DEFAULT 0,
      is_completed BOOLEAN DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, course_id)
    )
  `);

  // Reviews Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (course_id) REFERENCES courses(id)
    )
  `);

  // Quizzes Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      FOREIGN KEY (course_id) REFERENCES courses(id)
    )
  `);

  // User Progress Table (SCORM-like tracking)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      lesson_id INTEGER NOT NULL,
      status TEXT DEFAULT 'started', -- started, completed
      last_position INTEGER DEFAULT 0, -- in seconds or percentages
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (course_id) REFERENCES courses(id),
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
      UNIQUE(user_id, lesson_id)
    )
  `);
}
