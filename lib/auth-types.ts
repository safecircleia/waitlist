import { User } from "@/components/account/types";

export interface Session {
  user: User & {
    passkeys?: { id: string; name?: string; }[];
  };
  session: {
    id: string;
    token: string;
    userAgent?: string;
    current: boolean;
    impersonatedBy?: string;
  };
}

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthResponse<T> {
  data?: T;
  error?: AuthError;
} 