import { Router, Response } from 'express';
import { getDb } from '../db';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Only instructor can access these routes
// Instructors and Admins can access these routes
router.use(authenticate, authorize(['instructor', 'admin']));

router.get('/my-courses', async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const role = req.user?.role;
    try {
        const db = await getDb();
        let courses;
        if (role === 'admin') {
            courses = await db.all('SELECT c.*, u.name as instructor_name FROM courses c JOIN users u ON c.instructor_id = u.id');
        } else {
            courses = await db.all('SELECT * FROM courses WHERE instructor_id = ?', [userId]);
        }
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch instructor courses' });
    }
});

router.post('/courses/:id/publish', authorize(['admin']), async (req, res) => {
    const { id } = req.params;
    try {
        const db = await getDb();
        await db.run('UPDATE courses SET is_published = 1 WHERE id = ?', [id]);
        res.json({ message: 'Course published by administrative authority' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to publish asset' });
    }
});

router.post('/courses', async (req: AuthRequest, res: Response) => {
    const { title, categoryId, subtitle, description, price, thumbnail } = req.body;
    const userId = req.user?.id;

    try {
        const db = await getDb();
        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();
        const result = await db.run(
            'INSERT INTO courses (instructor_id, category_id, title, slug, subtitle, description, price, thumbnail, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, categoryId, title, slug, subtitle, description, price, thumbnail || '', 0]
        );
        res.status(201).json({ id: result.lastID, message: 'Course created (draft)' });
    } catch (err) {
        res.status(500).json({ error: 'Course creation failed' });
    }
});

router.post('/courses/:id/modules', async (req, res) => {
    const { title, sortOrder } = req.body;
    const { id } = req.params;
    try {
        const db = await getDb();
        await db.run('INSERT INTO modules (course_id, title, sort_order) VALUES (?, ?, ?)', [id, title, sortOrder]);
        res.status(201).json({ message: 'Module added' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add module' });
    }
});

router.post('/modules/:id/lessons', async (req, res) => {
    const { title, videoUrl, content, duration, sortOrder, isPreview, courseId } = req.body;
    const { id } = req.params;
    try {
        const db = await getDb();
        await db.run(
            'INSERT INTO lessons (module_id, course_id, title, video_url, content, duration, sort_order, is_preview) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, courseId, title, videoUrl, content, duration, sortOrder, isPreview ? 1 : 0]
        );
        res.status(201).json({ message: 'Lesson added' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add lesson' });
    }
});

router.get('/courses/:id/enrolled-users', async (req, res) => {
    const { id } = req.params;
    try {
        const db = await getDb();
        const users = await db.all(`
            SELECT u.id, u.name, u.email, e.enrolled_at, e.progress
            FROM enrollments e
            JOIN users u ON e.user_id = u.id
            WHERE e.course_id = ?
        `, [id]);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch enrolled users' });
    }
});

export default router;
