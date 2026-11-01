import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('4000').transform(Number),
    DATABASE_URL: z.string().default('postgresql://postgres:postgres@127.0.0.1:5432/levix?schema=public'),
    FRONTEND_URL: z.string().default('http://localhost:5173'),
    // Firebase Admin Credentials
    FIREBASE_PROJECT_ID: z.string().optional(),
    FIREBASE_CLIENT_EMAIL: z.string().optional(),
    FIREBASE_PRIVATE_KEY: z.string().optional(),
    FIREBASE_SERVICE_ACCOUNT_PATH: z.string().optional(),
    // Razorpay
    RAZORPAY_KEY_ID: z.string().default('rzp_test_placeholder'),
    RAZORPAY_KEY_SECRET: z.string().default('rzp_secret_placeholder'),
    RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
    // Cloudinary / Object Storage
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('CRITICAL: Invalid environment configuration:', parsed.error.format());
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
}
export const env = parsed.success ? parsed.data : envSchema.parse({});
