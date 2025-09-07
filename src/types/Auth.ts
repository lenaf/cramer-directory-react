import { User as FirebaseUser } from 'firebase/auth';

export interface User {
  id: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  photoURL?: string;
  email: string;
  status: string;
  loginCount: number;
  country: string;
  language: string;
  roleId: string;
  contactIds: string[];
}

export interface Role {
  id: string;
  name: string;
  permissionIds: string[];
}

export interface Auth extends FirebaseUser {
  user: User | null;
  role: Role | null;
}