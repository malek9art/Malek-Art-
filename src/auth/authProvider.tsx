import React, { useState, useEffect } from 'react';
import { AuthContext, AuthContextType } from './authContext';
import { AuthState, AuthResult } from './authTypes';
import { firebaseAuthService } from './firebaseAuthService';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = firebaseAuthService.subscribeAuthState((user) => {
      setState({
        user,
        session: user ? { token: "firebase_active_token", expiresAt: Date.now() + 86400000, user } : null,
        isAuthenticated: !!user,
        isLoading: false,
        error: null,
      });
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    const result = await firebaseAuthService.login(email, password);
    if (!result.success) {
      setState(prev => ({ ...prev, isLoading: false, error: result.error || "Login failed" }));
    }
    return result;
  };

  const logout = async (): Promise<void> => {
    await firebaseAuthService.logout();
    setState({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const contextValue: AuthContextType = {
    ...state,
    service: firebaseAuthService,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
