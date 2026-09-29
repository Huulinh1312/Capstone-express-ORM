import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { loginApi } from '../api/authApi';
import { getApiMessage } from '../api/axiosClient';
import { getProfileApi } from '../api/userApi';
import { storage } from '../utils/storage';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, mat_khau: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => storage.getToken());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(token));

  const refreshProfile = async () => {
    if (!storage.getToken()) return;
    try {
      setUser((await getProfileApi()).data);
    } catch {
      storage.clearToken();
      setToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    if (token) refreshProfile().finally(() => setLoading(false));
    else setLoading(false);
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      login: async (email, mat_khau) => {
        try {
          const result = await loginApi({ email, mat_khau });
          storage.setToken(result.data.token);
          setToken(result.data.token);
        } catch (error) {
          throw new Error(getApiMessage(error));
        }
      },
      logout: () => {
        storage.clearToken();
        setToken(null);
        setUser(null);
      },
      refreshProfile,
    }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth phải được dùng bên trong AuthProvider');
  return context;
}
