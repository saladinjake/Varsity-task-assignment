import { Router, Response } from 'express';
import { getDb } from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/courses', async (req, res) => {
    const { search, category, minPrice, maxPrice, sort, page = '1', limit = '20' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    try {
        const db = await getDb();
        let query = `
            SELECT c.*, u.name as instructor_name, cat.name as category_name
            FROM courses c
            JOIN users u ON c.instructor_id = u.id
            JOIN categories cat ON c.category_id = cat.id
            WHERE c.is_published = 1 AND c.is_expired = 0
        `;
        const params: any[] = [];

        if (search) {
            query += ` AND (c.title LIKE ? OR c.subtitle LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        if (category) {
            query += ` AND cat.slug = ?`;
            params.push(category);
        }

        if (minPrice !== undefined) {
            query += ` AND c.price >= ?`;
            params.push(Number(minPrice));
        }

        if (maxPrice !== undefined) {
            query += ` AND c.price <= ?`;
            params.push(Number(maxPrice));
        }

        if (sort === 'price_asc') query += ` ORDER BY c.price ASC`;
        else if (sort === 'price_desc') query += ` ORDER BY c.price DESC`;
        else if (sort === 'newest') query += ` ORDER BY c.created_at DESC`;
        else query += ` ORDER BY c.id DESC`;

        query += ` LIMIT ? OFFSET ?`;
        params.push(Number(limit), offset);

        const courses = await db.all(query, params);

        // Count total for pagination
        const countRes = await db.get(`SELECT COUNT(*) as total FROM courses c JOIN categories cat ON c.category_id = cat.id WHERE c.is_published = 1 AND c.is_expired = 0 ${category ? 'AND cat.slug = ?' : ''}`, category ? [category] : []);

        res.json({
            courses,
            pagination: {
                total: countRes.total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(countRes.total / Number(limit))
            }
        });
    } catch (err) {
        console.error('FETCH COURSES ERROR:', err);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

router.get('/categories', async (req, res) => {
    try {
        const db = await getDb();
        const categories = await db.all('SELECT * FROM categories');
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

router.get('/courses/:slug', async (req: AuthRequest, res: Response) => {
    const { slug } = req.params;
    const userId = req.user?.id;

    try {
        const db = await getDb();
        const course = await db.get(`
            SELECT c.*, u.name as instructor_name, cat.name as category_name
            FROM courses c
            JOIN users u ON c.instructor_id = u.id
            JOIN categories cat ON c.category_id = cat.id
            WHERE c.slug = ?
        `, [slug]);

        if (!course) return res.status(404).json({ error: 'Course not found' });

        const modules = await db.all('SELECT * FROM modules WHERE course_id = ? ORDER BY sort_order ASC', [course.id]);

        let enrollment = null;
        if (userId) {
            enrollment = await db.get('SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?', [userId, course.id]);
        }

        const isEnrolled = !!enrollment;
        const isFree = course.price === 0;

        // Fetch lessons for each module
        const modulesWithLessons = await Promise.all(modules.map(async (mod, index) => {
            const lessons = await db.all('SELECT * FROM lessons WHERE module_id = ? ORDER BY sort_order ASC', [mod.id]);

            // Logic: For paid courses, only the first two modules should be unlocked if not enrolled.
            const isUnlocked = isEnrolled || isFree || index < 2;

            return {
                ...mod,
                is_unlocked: isUnlocked,
                lessons: lessons.map(lesson => ({
                    ...lesson,
                    // If not unlocked, hide content/video_url
                    ...(isUnlocked ? {} : { content: null, video_url: null })
                }))
            };
        }));

        res.json({ ...course, is_enrolled: isEnrolled, modules: modulesWithLessons });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch course details' });
    }
});

router.post('/enroll', authenticate, async (req: AuthRequest, res: Response) => {
    const { courseId, paymentMethod, paymentId } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const db = await getDb();
        const course = await db.get('SELECT price FROM courses WHERE id = ?', [courseId]);

        if (!course) return res.status(404).json({ error: 'Course not found' });
        
        // Check if already enrolled
        const existingEnrollment = await db.get('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?', [userId, courseId]);
        if (existingEnrollment) {
            return res.status(400).json({ error: 'You are already enrolled in this course' });
        }

        // Logic error: If not free, must provide payment info
        if (course.price > 0 && (!paymentMethod || !paymentId)) {
            return res.status(400).json({ error: 'Payment required for this course' });
        }
        console.log(userId, courseId)
        await db.run(
            'INSERT INTO enrollments (user_id, course_id, payment_method, payment_id) VALUES (?, ?, ?, ?)',
            [userId, courseId, paymentMethod || 'free', paymentId || 'FREE_ACCESS']
        );

        res.status(201).json({ message: 'Enrolled successfully' });
    } catch (err) {
        console.log(err, ">>>>")
        res.status(500).json({ error: 'Enrollment failed or already enrolled' });
    }
});

router.get('/my-courses', authenticate, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    try {
        const db = await getDb();
        const rawCourses = await db.all(`
            SELECT c.*, e.enrolled_at, u.name as instructor_name,
            (SELECT COUNT(*) FROM lessons WHERE course_id = c.id) as total_lessons,
            (SELECT COUNT(*) FROM user_progress WHERE user_id = ? AND course_id = c.id AND status = 'completed') as completed_lessons
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            JOIN users u ON c.instructor_id = u.id
            WHERE e.user_id = ?
        `, [userId, userId]);

        const courses = rawCourses.map(c => ({
            ...c,
            progress: c.total_lessons > 0 ? (c.completed_lessons / c.total_lessons) * 100 : 0
        }));

        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch enrolled courses' });
    }
});

router.get('/my-progress/:courseId', authenticate, async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params;
    const userId = req.user?.id;
    try {
        const db = await getDb();
        const progress = await db.all('SELECT * FROM user_progress WHERE user_id = ? AND course_id = ?', [userId, courseId]);
        res.json(progress);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
});

router.post('/update-progress', authenticate, async (req: AuthRequest, res: Response) => {
    const { courseId, lessonId, status, lastPosition } = req.body;
    const userId = req.user?.id;
    try {
        const db = await getDb();
        await db.run(`
            INSERT INTO user_progress (user_id, course_id, lesson_id, status, last_position)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(user_id, lesson_id) DO UPDATE SET
            status = excluded.status,
            last_position = excluded.last_position,
            updated_at = CURRENT_TIMESTAMP
        `, [userId, courseId, lessonId, status, lastPosition || 0]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update progress' });
    }
});

export default router;
