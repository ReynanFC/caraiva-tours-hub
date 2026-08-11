import { UserRole } from '../../../shared/models/user.model';

export interface CreateUserRequest {
  fullName: string;
  userName: string;
  email: string;
  pixKey: string;
  role: UserRole;
}
