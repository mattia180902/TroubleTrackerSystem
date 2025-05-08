export type Role = 'ADMIN' | 'AGENT' | 'USER';

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  department?: string;
  avatarUrl?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserFormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  department?: string;
  password?: string; // Only needed for creation
}