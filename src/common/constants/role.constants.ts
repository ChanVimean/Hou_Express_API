export const UserRoles = {
  CEO: 'CEO',
  DEPARTMENT_MANAGER: 'DEPARTMENT_MANAGER',
  SUPERVISOR: 'SUPERVISOR',
  STAFF: 'STAFF',
  ADMIN: 'ADMIN',
} as const;

export type Role = (typeof UserRoles)[keyof typeof UserRoles];
