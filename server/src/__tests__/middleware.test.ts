import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'varsity_secret_key_2026';

describe('Middleware', () => {
    let mockRequest: Partial<AuthRequest>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = vi.fn();

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        nextFunction = vi.fn();
    });

    describe('authenticate', () => {
        it('should return 401 if no token is provided', () => {
            mockRequest.headers = {};
            authenticate(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Authentication required' });
        });

        it('should call next() if valid token is provided', () => {
            const payload = { id: 1, email: 'test@test.com', role: 'student' };
            const token = jwt.sign(payload, JWT_SECRET);
            mockRequest.headers = { authorization: `Bearer ${token}` };

            authenticate(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
            expect(mockRequest.user).toMatchObject(payload);
        });

        it('should return 401 if invalid token is provided', () => {
            mockRequest.headers = { authorization: 'Bearer invalid-token' };
            authenticate(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid token' });
        });
    });

    describe('authorize', () => {
        it('should return 403 if user role is not allowed', () => {
            mockRequest.user = { id: 1, email: 'test@test.com', role: 'student' };
            const middleware = authorize(['admin']);
            middleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Permission denied' });
        });

        it('should call next() if user role is allowed', () => {
            mockRequest.user = { id: 1, email: 'test@test.com', role: 'admin' };
            const middleware = authorize(['admin', 'instructor']);
            middleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
        });
    });
});
