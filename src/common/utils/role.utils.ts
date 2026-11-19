import { ForbiddenException } from '@nestjs/common';
import { Role, UserRoles } from '../constants/role.constants.js';

const managementRoles: Role[] = [
  UserRoles.CEO,
  UserRoles.DEPARTMENT_MANAGER,
  UserRoles.SUPERVISOR,
  UserRoles.ADMIN,
];

export const hasRole = (userRole: Role, role: Role): boolean => {
  return userRole === role;
};

export const hasAnyRole = (userRole: Role, roles: Role[]): boolean => {
  return roles.includes(userRole);
};

export const isManagementRole = (role: Role): boolean => {
  return managementRoles.includes(role);
};

export const isAdmin = (role: Role): boolean => {
  return role === UserRoles.ADMIN;
};

export const isCEO = (role: Role): boolean => {
  return role === UserRoles.CEO;
};

export const isStaff = (role: Role): boolean => {
  return role === UserRoles.STAFF;
};

export const assertRole = (userRole: Role, allowedRoles: Role[]): void => {
  if (!allowedRoles.includes(userRole)) {
    throw new ForbiddenException('You do not have permission');
  }
};
