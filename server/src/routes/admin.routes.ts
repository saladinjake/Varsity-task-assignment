import { Router, Response } from 'express';
import { getDb } from '../db';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Only admin can access these routes
router.use(authenticate, authorize(['admin']));

router.get('/users', async (req, res) => {
    try {
        const db = await getDb();
        const users = await db.all('SELECT id, name, email, role, is_verified, is_disabled, created_at FROM users');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

router.post('/users/:id/toggle-disabled', async (req, res) => {
    const { id } = req.params;
    try {
        const db = await getDb();
        const user = await db.get('SELECT is_disabled FROM users WHERE id = ?', [id]);
        if (!user) return res.status(404).json({ error: 'User not found' });

        await db.run('UPDATE users SET is_disabled = ? WHERE id = ?', [user.is_disabled ? 0 : 1, id]);
        res.json({ message: 'User updated' });
    } catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
});

router.post('/instructors/:id/verify', async (req, res) => {
    const { id } = req.params;
    try {
        const db = await getDb();
        await db.run('UPDATE users SET is_verified = 1 WHERE id = ? AND role = "instructor"', [id]);
        res.json({ message: 'Instructor verified' });
    } catch (err) {
        res.status(500).json({ error: 'Verification failed' });
    }
});

router.post('/courses/:id/toggle-expire', async (req, res) => {
    const { id } = req.params;
    try {
        const db = await getDb();
        const course = await db.get('SELECT is_expired FROM courses WHERE id = ?', [id]);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        await db.run('UPDATE courses SET is_expired = ? WHERE id = ?', [course.is_expired ? 0 : 1, id]);
        res.json({ message: 'Course updated' });
    } catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
});

router.post('/assign-course', async (req, res) => {
    const { userId, courseId } = req.body;
    try {
        const db = await getDb();
        await db.run('INSERT INTO enrollments (user_id, course_id, payment_method) VALUES (?, ?, ?)', [userId, courseId, 'assigned']);
        res.status(201).json({ message: 'Course assigned' });
    } catch (err) {
        res.status(500).json({ error: 'Assignment failed' });
    }
});

export default router;
