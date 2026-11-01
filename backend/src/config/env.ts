import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.string().default('production'),
  PORT: z.union([z.string(), z.number()]).default(4000).transform(val => Number(val) || 4000),
  DATABASE_URL: z.string().optional().default(''),
  FRONTEND_URL: z.string().optional().default('https://thelevix.shop'),
  
  // Firebase Admin Credentials
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_SERVICE_ACCOUNT_PATH: z.string().optional(),

  // Razorpay
  RAZORPAY_KEY_ID: z.string().optional().default('rzp_test_placeholder'),
  RAZORPAY_KEY_SECRET: z.string().optional().default('rzp_secret_placeholder'),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),

  // Cloudinary / Object Storage
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
}).passthrough();

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.warn('⚠️ Warning: Environment configuration details:', parsed.error.format());
}

export const env = parsed.success ? parsed.data : {
  NODE_ENV: process.env.NODE_ENV || 'production',
  PORT: Number(process.env.PORT) || 4000,
  DATABASE_URL: process.env.DATABASE_URL || '',
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://thelevix.shop',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  FIREBASE_SERVICE_ACCOUNT_PATH: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
};
