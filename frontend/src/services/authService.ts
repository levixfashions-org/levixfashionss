import { auth, setCurrentUser, MockUser } from '../config/firebase';

export const authService = {
  // Register with email and password
  async register(email: string, pass: string, displayName: string): Promise<MockUser> {
    const uid = 'usr_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    const user: MockUser = {
      uid,
      email,
      displayName: displayName || email.split('@')[0],
      emailVerified: true,
      getIdToken: async () => `dev-mock-token-${uid}`
    };
    setCurrentUser(user);
    return user;
  },

  // Login with email and password
  async login(email: string, pass: string): Promise<MockUser> {
    const cleanEmail = email.trim();
    const uid = 'usr_' + Math.random().toString(36).substring(2, 9);
    const user: MockUser = {
      uid,
      email: cleanEmail,
      displayName: cleanEmail.toLowerCase() === 'levixfashions@gmail.com' ? 'Levix Owner' : cleanEmail.split('@')[0],
      emailVerified: true,
      getIdToken: async () => `dev-mock-token-${cleanEmail}-${uid}`
    };
    setCurrentUser(user);
    return user;
  },

  // Sign in with Google
  async loginWithGoogle(): Promise<MockUser> {
    const uid = 'google_' + Math.random().toString(36).substring(2, 9);
    const user: MockUser = {
      uid,
      email: 'customer@gmail.com',
      displayName: 'Streetwear Collector',
      emailVerified: true,
      getIdToken: async () => `dev-mock-token-${uid}`
    };
    setCurrentUser(user);
    return user;
  },

  // Password reset email
  async resetPassword(email: string): Promise<void> {
    console.log(`Password reset dispatched for ${email}`);
  },

  // Logout
  async logout(): Promise<void> {
    setCurrentUser(null);
  },

  // Get current Bearer ID Token
  async getToken(forceRefresh = false): Promise<string | null> {
    if (!auth.currentUser) return null;
    return auth.currentUser.getIdToken(forceRefresh);
  }
};
