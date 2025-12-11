import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { getDb } from '../db';
import Stripe from 'stripe';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16' as any,
});

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

router.post('/create-session', authenticate, async (req: AuthRequest, res: Response) => {
    const { courseId, paymentMethod } = req.body;
    const userId = req.user?.id;
    const paymentMode = process.env.PAYMENT_MODE || 'simulated';

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const db = await getDb();
        const course = await db.get('SELECT * FROM courses WHERE id = ?', [courseId]);

        if (!course) return res.status(404).json({ error: 'Course not found' });

        if (paymentMode === 'simulated') {
            return res.json({
                mode: 'simulated',
                message: 'Simulation mode active',
                paymentId: 'SIM-' + Math.random().toString(36).substr(2, 9).toUpperCase()
            });
        }

        if (paymentMethod === 'stripe') {
            const session = await stripe.paymentIntents.create({
                amount: Math.round(course.price * 100), // convert to cents
                currency: 'usd',
                metadata: { courseId, userId },
                automatic_payment_methods: { enabled: true },
            });

            return res.json({
                mode: 'stripe',
                clientSecret: session.client_secret,
                paymentId: session.id
            });
        } else if (paymentMethod === 'paystack') {
            const response = await axios.post(
                'https://api.paystack.co/transaction/initialize',
                {
                    amount: Math.round(course.price * 100 * 1500), // Assuming NGN for paystack, fixed rate or config needed
                    email: req.user?.email,
                    metadata: { courseId, userId },
                },
                {
                    headers: {
                        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return res.json({
                mode: 'paystack',
                access_code: response.data.data.access_code,
                reference: response.data.data.reference,
            });
        }

        res.status(400).json({ error: 'Invalid payment method' });
    } catch (err: any) {
        console.error('PAYMENT SESSION ERROR:', err.message);
        res.status(500).json({ error: 'Failed to initialize payment' });
    }
});

router.post('/verify-paystack', authenticate, async (req: AuthRequest, res: Response) => {
    const { reference } = req.body;

    try {
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            },
        });

        if (response.data.data.status === 'success') {
            res.json({ success: true, data: response.data.data });
        } else {
            res.status(400).json({ success: false, message: 'Payment verification failed' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Verification error' });
    }
});

export default router;
