import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'varsity_secret_key_2026';

router.post('/register', async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;
    try {
        const db = await getDb();
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Instructors who sign up are not verified by default
        const isVerified = (role === 'student' || role === 'admin') ? 1 : 0; 

        await db.run(
            'INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role, isVerified]
        );
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed or user already exists' });
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const db = await getDb();
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

        if (!user || user.is_disabled) {
            return res.status(401).json({ error: 'Invalid credentials or account disabled' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role, is_verified: user.is_verified }
        });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

export default router;
