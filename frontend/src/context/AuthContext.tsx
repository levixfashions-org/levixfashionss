import React, { createContext, useContext, useEffect, useState } from 'react';
import { onIdTokenChanged, auth, MockUser } from '../config/firebase';
import { authService } from '../services/authService';
import { apiClient } from '../services/api';
import { UserProfile } from '../types';

interface AuthContextType {
  user: MockUser | null;
  profile: UserProfile | null;
  loading: boolean;
  idToken: string | null;
  isAdmin: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  idToken: null,
  isAdmin: false,
  logout: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await apiClient.get('/auth/profile');
      if (res.data?.user) {
        setProfile(res.data.user);
      }
    } catch (err) {
      // Mock fallback profile if backend isn't running
      if (user) {
        setProfile({
          id: user.uid,
          firebaseUid: user.uid,
          email: user.email || 'customer@thelevix.shop',
          name: user.displayName || 'Levix Client',
          phone: '',
          role: user.email?.toLowerCase() === 'levixfashions@gmail.com' ? 'ADMIN' : 'CUSTOMER',
          addresses: []
        });
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          setIdToken(token);
          await fetchProfile();
        } catch (err) {
          console.error('Error obtaining token:', err);
        }
      } else {
        setIdToken(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setProfile(null);
    setIdToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        idToken,
        isAdmin: Boolean(
          (user?.email && user.email.trim().toLowerCase() === 'levixfashions@gmail.com') ||
          (profile?.role === 'ADMIN' && profile?.email?.trim().toLowerCase() === 'levixfashions@gmail.com')
        ),
        logout,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
