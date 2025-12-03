import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import courseRoutes from './routes/course.routes';
import adminRoutes from './routes/admin.routes';
import instructorRoutes from './routes/instructor.routes';
import paymentRoutes from './routes/payment.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', platform: 'Varsity EdTech' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', courseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/payment', paymentRoutes);

export default app;
