import { useCookies } from '@/hooks';
import axios from 'axios';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
 ;

interface AuthContextType {
  isAuthenticated: boolean | null;
  login: (token: string, userId: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  get_current_user: () => Promise<string | null>;
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
    // await deleteItemInSession({key:'user_id', storageType:'local'});
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

  const login = async (token: string, userId: string) => {
    await storeItemInSession({key:'access_token', val:userId+'='+token, ttl:1000*60*60*24*90}); //90days 
    // await storeItemInSession({key:'user_id', val:userId, storageType:'local', ttl:1000*60*60*24*90}); //90days 
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    // router.replace(PAGE_ROUTES.LOGGED_IN_SCREEN);
  };

  const logout = async () => {
    await deleteItemInSession({key:'access_token', storageType:'secure'});
    // await deleteItemInSession({key:'user_id', storageType:'local'});
    delete axios.defaults.headers.common.Authorization;
    // router.replace(PAGE_ROUTES.HOME_SCREEN);
  };
  const get_current_user = async () => {
    const user_id = await getItemInSession({key:'access_token', storageType:'secure'});
    const user_id_parts = user_id?.split('=');
    return user_id_parts?.[0] || null;
  };
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: user==null?null:!!user,
        login,
        logout,
        isLoading,
        get_current_user
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