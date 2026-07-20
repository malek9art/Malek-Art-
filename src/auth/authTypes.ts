// 🔐 Authentication Layer Types & Interfaces Definition

export type Roles = 'admin' | 'editor' | 'viewer';

export type Permissions = 
  | 'manage_projects'
  | 'manage_services'
  | 'manage_skills'
  | 'manage_config'
  | 'manage_users'
  | 'read_messages'
  | 'delete_messages'
  | 'approve_reviews';

export interface User {
  id: string;
  email: string;
  displayName?: string;
  role: Roles;
  permissions: Permissions[];
  createdAt: string;
  lastLoginAt?: string;
}

export interface Session {
  token: string;
  expiresAt: number;
  user: User;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  session?: Session;
  error?: string;
}
