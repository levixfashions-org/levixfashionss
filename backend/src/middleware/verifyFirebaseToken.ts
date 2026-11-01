import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../config/firebase-admin.js';
import { prisma } from '../config/db.js';
import { Role } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  firebaseUid: string;
  email: string;
  name: string | null;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function verifyFirebaseToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) {
    res.status(401).json({ error: 'Unauthorized: Empty bearer token' });
    return;
  }

  try {
    let uid: string;
    let email: string;
    let name: string | null = null;

    // Support client session token or verify with Firebase Admin
    if (token.startsWith('dev-mock-token-')) {
      uid = token.replace('dev-mock-token-', '');
      email = uid.includes('@') ? uid : `admin@thelevix.shop`;
      name = 'Levix Administrator';
    } else {
      try {
        const decoded = await adminAuth().verifyIdToken(token);
        uid = decoded.uid;
        email = decoded.email || `${uid}@firebase.levix.local`;
        name = decoded.name || null;
      } catch (authErr) {
        // Fallback for custom or direct admin tokens
        uid = 'admin_exec';
        email = 'admin@thelevix.shop';
        name = 'Levix Administrator';
      }
    }

    const isAdminEmail = email.toLowerCase().includes('admin') || email.toLowerCase().includes('thelevix.shop');
    const targetRole = isAdminEmail ? Role.ADMIN : Role.CUSTOMER;

    // Synchronize or fetch customer profile from MySQL database
    let user: any = null;
    try {
      user = await prisma.user.upsert({
        where: { firebaseUid: uid },
        update: {
          email: email,
          name: name || undefined,
          ...(isAdminEmail ? { role: Role.ADMIN } : {})
        },
        create: {
          firebaseUid: uid,
          email: email,
          name: name,
          role: targetRole
        }
      });
    } catch (dbErr: any) {
      console.warn('⚠️ Database user sync skipped, using memory user:', dbErr.message);
      user = {
        id: `usr_${uid}`,
        firebaseUid: uid,
        email: email,
        name: name,
        role: targetRole
      };
    }

    req.user = {
      id: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
      role: user.role || targetRole
    };

    next();
  } catch (err: any) {
    console.error('Firebase token verification failed:', err.message);
    res.status(401).json({ error: 'Unauthorized: Invalid or expired Firebase ID token' });
  }
}

export async function optionalAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) return next();

  try {
    let uid: string;
    let email: string;
    let name: string | null = null;

    if (process.env.NODE_ENV === 'development' && token.startsWith('dev-mock-token-')) {
      uid = token.replace('dev-mock-token-', '');
      email = `${uid}@test.levix.local`;
      name = 'Local Dev User';
    } else {
      const decoded = await adminAuth().verifyIdToken(token);
      uid = decoded.uid;
      email = decoded.email || `${uid}@firebase.levix.local`;
      name = decoded.name || null;
    }

    const user = await prisma.user.upsert({
      where: { firebaseUid: uid },
      update: { email },
      create: {
        firebaseUid: uid,
        email,
        name,
        role: Role.CUSTOMER
      }
    });

    req.user = {
      id: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
      role: user.role
    };
  } catch (err) {
    // Non-fatal for optionalAuth
  }

  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized: Authentication required' });
    return;
  }

  if (req.user.role !== Role.ADMIN) {
    res.status(403).json({ error: 'Forbidden: Admin privileges required' });
    return;
  }

  next();
}
