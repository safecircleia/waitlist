// Common types for account components
export interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string;
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  identities?: any[];
  factors?: any[];
}

export interface ReferralData {
  referralCode?: string;
  hasJoinedWaitlist?: boolean;
}

export interface ConnectedAccounts {
  google: boolean;
  github: boolean;
  passkey: boolean;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Session {
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
  sessionToken?: string;
}
