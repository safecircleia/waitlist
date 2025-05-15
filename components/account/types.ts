// Common types for account components
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  twoFactorEnabled?: boolean;
  passkeys?: { id: string; name?: string; }[];
}

export interface ReferralData {
  code: string;
  count: number;
  limit: number;
}

export interface ConnectedAccounts {
  github?: {
    id: string;
    username: string;
  };
  google?: {
    id: string;
    email: string;
  };
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Session {
  id: string;
  sessionToken: string;
  userAgent?: string;
  current?: boolean;
}
