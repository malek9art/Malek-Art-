import { createContext, useContext } from 'react';
import { AuthState, AuthResult } from './authTypes';
import { IAuthService } from './authService';

export interface AuthContextType extends AuthState {
  service: IAuthService;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
