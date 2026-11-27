import { Request } from 'express';
import { AuthenticatedUser } from '../types/authenticated-user.type.js';

export interface AuthenticatedRequestDto extends Request {
  user: AuthenticatedUser;
}
