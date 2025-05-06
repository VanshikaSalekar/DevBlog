
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from "sonner";

// This is a placeholder until Supabase is integrated
type User = {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  theme_pref?: 'dark' | 'light';
  role?: 'user' | 'admin';
} | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<Omit<NonNullable<User>, 'id' | 'email' | 'role'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin user credentials
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  // This will be replaced with actual Supabase auth logic
  useEffect(() => {
    // Simulate checking for an existing session
    const checkSession = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Special case for admin user
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser = {
          id: 'admin-user-id',
          email: ADMIN_EMAIL,
          display_name: 'Admin User',
          avatar_url: 'https://ui-avatars.com/api/?name=Admin+User&background=red',
          role: 'admin' as const,
        };
        
        localStorage.setItem('user', JSON.stringify(adminUser));
        setUser(adminUser);
        toast.success('Signed in as admin successfully!');
        return;
      }
      
      // This is a mock implementation until Supabase is integrated
      // In a real app, we would verify credentials with Supabase Auth
      const mockUser = {
        id: 'mock-user-id',
        email,
        display_name: email.split('@')[0],
        role: 'user' as const
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast.success('Signed in successfully!');
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // This is a mock implementation until Supabase is integrated
      // In a real app, we would create a new user with Supabase Auth
      const mockUser = {
        id: 'mock-user-id-' + Date.now(),
        email,
        display_name: email.split('@')[0],
        role: 'user' as const
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast.success('Account created successfully!');
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // In a real app, we would use Supabase Auth signOut()
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Signed out successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
      throw error;
    }
  };

  const updateProfile = async (profile: Partial<Omit<NonNullable<User>, 'id' | 'email' | 'role'>>) => {
    try {
      if (!user) throw new Error('No user is signed in');
      
      // In a real app, we would update the user profile in Supabase
      const updatedUser = { ...user, ...profile };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success('Profile updated successfully!');
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
