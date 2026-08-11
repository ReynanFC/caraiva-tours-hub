export type UserRole = 'ADMIN' | 'EMPLOYEE';

export interface UserSummary {
  id: number;
  userName: string;
  email: string;
  role: UserRole;
  enabled: boolean;
}

export interface UserDetails {
  id: number;
  userName: string;
  fullName: string;
  email: string;
  pixKey: string | null;
  role: UserRole;
  createdAt: string;
}

export interface UpdateUserRequest {
  userName: string;
  email: string;
  pixKey: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
