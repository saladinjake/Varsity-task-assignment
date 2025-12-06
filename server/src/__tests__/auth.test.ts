import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';
import * as dbModule from '../db';
import bcrypt from 'bcryptjs';

vi.mock('../db', () => ({
    getDb: vi.fn(),
}));

describe('Auth Routes', () => {
    let mockDb: any;

    beforeEach(() => {
        mockDb = {
            run: vi.fn(),
            get: vi.fn(),
            all: vi.fn(),
            exec: vi.fn(),
        };
        (dbModule.getDb as any).mockResolvedValue(mockDb);
    });

    it('should register a new user', async () => {
        mockDb.run.mockResolvedValue({ changes: 1 });
        
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Victor',
                email: 'victor@example.com',
                password: 'password123',
                role: 'student'
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
        expect(mockDb.run).toHaveBeenCalled();
    });

    it('should login an existing user', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        mockDb.get.mockResolvedValue({
            id: 1,
            name: 'Victor',
            email: 'victor@example.com',
            password: hashedPassword,
            role: 'student',
            is_disabled: 0,
            is_verified: 1
        });

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'victor@example.com',
                password: 'password123'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.user.name).toBe('Victor');
    });

    it('should return 401 for invalid credentials', async () => {
        mockDb.get.mockResolvedValue(null);

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'wrong@example.com',
                password: 'password123'
            });

        expect(response.status).toBe(401);
        expect(response.body.error).toContain('Invalid credentials');
    });
});
