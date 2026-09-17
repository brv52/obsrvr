export enum Role {
  User = 'user',
  Admin = 'admin',
}

export function isRole(value: any) : value is Role {
  return value === Role.User || value === Role.Admin;
}

export type User = {
    id: string;
    email: string;
    name?: string;
    role: Role;
}

export type Contributor = {
  email: string,
  role: 'VIEWER' | 'EDITOR' | 'OWNER'
}