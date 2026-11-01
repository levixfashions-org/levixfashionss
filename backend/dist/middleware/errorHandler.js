import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
export class AppError extends Error {
    statusCode;
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
export function errorHandler(err, req, res, next) {
    // 1. Zod Validation Errors
    if (err instanceof ZodError) {
        res.status(400).json({
            error: 'Validation Error',
            details: err.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
        return;
    }
    // 2. Custom AppError
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
    }
    // 3. Prisma Known Request Errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            res.status(409).json({ error: 'A record with this unique value already exists' });
            return;
        }
        if (err.code === 'P2025') {
            res.status(404).json({ error: 'The requested resource was not found' });
            return;
        }
    }
    // 4. Fallback 500 Internal Server Error
    console.error('Unhandled Server Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' ? { message: err.message, stack: err.stack } : {})
    });
}
