// Modular Firebase Auth Client with Local Storage Fallback for Dev Preview

export interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  getIdToken: (forceRefresh?: boolean) => Promise<string>;
}

const STORAGE_KEY = 'levix_auth_user';

let currentAuthUser: MockUser | null = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        getIdToken: async () => `dev-mock-token-${parsed.uid}`
      };
    }
  } catch (e) {}
  return null;
})();

const listeners: Array<(user: MockUser | null) => void> = [];

export const auth = {
  get currentUser() {
    return currentAuthUser;
  }
};

export function setCurrentUser(user: MockUser | null) {
  currentAuthUser = user;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified
    }));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  listeners.forEach(fn => fn(user));
}

export function onIdTokenChanged(authObj: any, callback: (user: MockUser | null) => void) {
  listeners.push(callback);
  // Initial fire
  setTimeout(() => callback(currentAuthUser), 10);
  return () => {
    const idx = listeners.indexOf(callback);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

export const googleProvider = {
  setCustomParameters: () => {}
};

export const app = {
  name: '[DEFAULT]',
  options: {}
};
