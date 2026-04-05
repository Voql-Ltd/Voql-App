import { useCookies } from '@/hooks';
import axios from 'axios';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
 ;

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextComponentProps {
  children: ReactNode;
}

export default function AuthContextComponent({ children }: AuthContextComponentProps) {
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {getItemInSession, storeItemInSession, deleteItemInSession}=useCookies()
  
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = await getItemInSession({key:'access_token'});

        if (token) {
          // axios.defaults.headers.common.Authorization = `Bearer ${token}`;
          setUser(token);
        }
        else{
            setUser('')
        }
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        console.log('Auth restore error:', e);
      }
    };

    bootstrap();
  }, []);

  const login = async (token: string) => {
    await storeItemInSession({key:'access_token', val:token});
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    // router.replace(PAGE_ROUTES.LOGGED_IN_SCREEN);
  };

  const logout = async () => {
    await deleteItemInSession({key:'access_token', storageType:'secure'});
    delete axios.defaults.headers.common.Authorization;
    // router.replace(PAGE_ROUTES.HOME_SCREEN);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        login,
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}