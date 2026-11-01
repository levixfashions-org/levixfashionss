import admin from 'firebase-admin';
import fs from 'fs';
import { env } from './env.js';

let firebaseApp: admin.app.App | null = null;

export function getFirebaseAdmin(): admin.app.App {
  if (firebaseApp) return firebaseApp;

  if (admin.apps.length > 0) {
    firebaseApp = admin.apps[0]!;
    return firebaseApp;
  }

  try {
    // 1. Service account file path check
    if (env.FIREBASE_SERVICE_ACCOUNT_PATH && fs.existsSync(env.FIREBASE_SERVICE_ACCOUNT_PATH)) {
      const serviceAccount = JSON.parse(fs.readFileSync(env.FIREBASE_SERVICE_ACCOUNT_PATH, 'utf8'));
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin initialized with service account file.');
      return firebaseApp;
    }

    // 2. Environment variables check
    if (env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
      const privateKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: env.FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey
        })
      });
      console.log('Firebase Admin initialized with credentials from environment.');
      return firebaseApp;
    }

    // 3. Fallback for development / mock verification if credentials are yet to be supplied
    console.warn('WARNING: Firebase Admin credentials not fully configured. Running in mock/development mode.');
    firebaseApp = admin.initializeApp({
      projectId: 'levix-dev-mock'
    });
    return firebaseApp;
  } catch (err: any) {
    console.error('Failed to initialize Firebase Admin SDK:', err.message);
    throw err;
  }
}

export const adminAuth = () => getFirebaseAdmin().auth();
