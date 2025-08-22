import { User as FirebaseUser, UserInfo, UserMetadata } from 'firebase/auth';
import { User } from './User';

export interface Auth extends FirebaseUser {
    user: User;
    role?: any;
}

export const getPermissionIds = (auth: Auth): string[] => {
    const userPermissions = auth.user?.permissionIds || [];
    const rolePermissions = auth.role?.permissionIds || [];
    const allPermissions = [...userPermissions, ...rolePermissions];
    const uniquePermissions = Array.from(new Set(allPermissions));
    return uniquePermissions.sort();
};