// 📜 IAuthService Interface Contract

import { User, AuthResult, Permissions } from './authTypes';

export interface IAuthService {
  login(email: string, password: string): Promise<AuthResult>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  changePassword(oldPassword: string, newPassword: string): Promise<AuthResult>;
  resetPassword(email: string): Promise<AuthResult>;
  hasPermission(permission: Permissions): boolean;
  refreshSession(): Promise<AuthResult>;
}
