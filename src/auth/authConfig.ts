// ⚙️ Auth Configuration Constants

export const AUTH_CONFIG = {
  COLLECTIONS: {
    ADMIN_USERS: 'admin_users',
    SESSIONS: 'sessions',
  },
  ENV_VARS: {
    ADMIN_EMAIL: 'VITE_ADMIN_EMAIL',
    FIREBASE_API_KEY: 'VITE_FIREBASE_API_KEY',
  },
  STORAGE_KEYS: {
    SESSION_TOKEN: 'malek_logic_session_token',
    ACTIVE_USER: 'malek_logic_active_user',
  },
  CONSTANTS: {
    SESSION_DURATION_HOURS: 24,
    MIN_PASSWORD_LENGTH: 8,
  }
} as const;
