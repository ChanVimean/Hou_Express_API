import { Role } from '../../../common/constants/role.constants.js';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: Role;
}
