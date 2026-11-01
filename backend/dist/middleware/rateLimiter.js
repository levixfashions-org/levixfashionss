import rateLimit from 'express-rate-limit';
export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // Limit each IP to 300 requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many requests from this IP, please try again after 15 minutes'
    }
});
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30, // 30 requests per 15 minutes for auth endpoints
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many authentication attempts, please try again later'
    }
});
export const checkoutRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20, // 20 checkout attempts per 10 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many checkout attempts, please slow down'
    }
});
