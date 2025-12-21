import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('App API', () => {
    it('should return 200 and ok status for health check', async () => {
        const response = await request(app).get('/api/health');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok', platform: 'Varsity EdTech' });
    });

    it('should return 404 for unknown route', async () => {
        const response = await request(app).get('/api/unknown');
        expect(response.status).toBe(404);
    });
});
