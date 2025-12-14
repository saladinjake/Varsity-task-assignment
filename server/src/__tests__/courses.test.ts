import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';
import * as dbModule from '../db';

vi.mock('../db', () => ({
    getDb: vi.fn(),
}));

describe('Course Routes', () => {
    let mockDb: any;

    beforeEach(() => {
        mockDb = {
            all: vi.fn(),
            get: vi.fn(),
            run: vi.fn(),
        };
        (dbModule.getDb as any).mockResolvedValue(mockDb);
    });

    describe('GET /api/courses', () => {
        it('should return a list of published courses', async () => {
            const mockCourses = [
                { id: 1, title: 'React Basics', slug: 'react-basics', price: 0, is_published: 1, is_expired: 0 },
                { id: 2, title: 'Node Mastery', slug: 'node-mastery', price: 99, is_published: 1, is_expired: 0 }
            ];
            mockDb.all.mockResolvedValue(mockCourses);
            mockDb.get.mockResolvedValue({ total: 2 });

            const response = await request(app).get('/api/courses');

            expect(response.status).toBe(200);
            expect(response.body.courses).toHaveLength(2);
            expect(response.body.pagination.total).toBe(2);
        });

        it('should handle search queries', async () => {
            mockDb.all.mockResolvedValue([]);
            mockDb.get.mockResolvedValue({ total: 0 });

            const response = await request(app).get('/api/courses?search=React');

            expect(response.status).toBe(200);
            expect(mockDb.all).toHaveBeenCalled();
            // Verify that the query includes a search parameter
            const call = mockDb.all.mock.calls[0];
            expect(call[0]).toContain('LIKE');
            expect(call[1]).toContain('%React%');
        });
    });

    describe('GET /api/categories', () => {
        it('should return all categories', async () => {
            const categories = [{ id: 1, name: 'Development', slug: 'development' }];
            mockDb.all.mockResolvedValue(categories);

            const response = await request(app).get('/api/categories');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(categories);
        });
    });
});
