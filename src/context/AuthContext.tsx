import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, securityQuestion: string, securityAnswer: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string, securityAnswer: string, newPassword: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  resetPassword: async () => {},
  error: null,
  clearError: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (email === 'admin@example.com' && password === 'password') {
        const user = {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          isAdmin: true,
        };
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      } else if (email === 'user@example.com' && password === 'password') {
        const user = {
          id: '2',
          name: 'Regular User',
          email: 'user@example.com',
          isAdmin: false,
        };
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    securityQuestion: string, 
    securityAnswer: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (email === 'admin@example.com' || email === 'user@example.com') {
        throw new Error('Email already exists');
      }
      
      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        isAdmin: false,
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem(`security_${email}`, JSON.stringify({
        question: securityQuestion,
        answer: securityAnswer.toLowerCase()
      }));
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const resetPassword = async (
    email: string, 
    securityAnswer: string, 
    newPassword: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!(email === 'admin@example.com' || email === 'user@example.com')) {
        throw new Error('Email not found');
      }
      
      const securityInfo = localStorage.getItem(`security_${email}`);
      
      if (!securityInfo) {
        if (email === 'admin@example.com' || email === 'user@example.com') {
          if (securityAnswer.toLowerCase() !== 'demo') {
            throw new Error('Incorrect security answer');
          }
        } else {
          throw new Error('Security information not found');
        }
      } else {
        const { answer } = JSON.parse(securityInfo);
        if (securityAnswer.toLowerCase() !== answer) {
          throw new Error('Incorrect security answer');
        }
      }
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        resetPassword,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};