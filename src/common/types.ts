export enum AuthRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum AdminRole {
  VIEWER = 'viewer',
  ADMIN_MNGT = 'admin_mngt',
}

export interface JwtPayload {
  sub: string;
  role: AuthRole;
  adminRole?: AdminRole;
  iat?: number;
  exp?: number;
}

export enum AdminStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

export type SuccessResponse = {
  success: boolean;
  message: string;
  data: any;
};

export enum DecoratorKey {
  ROLES = 'roles',
  IGNORE_CHANGE_PASSWORD = 'ignoreChangePassword',
}
