export interface User {
    id: string;
    isActive: boolean;
    email: string;
    displayName?: string;
    photoURL?: string;
    roleId?: string;
    permissionIds?: string[];
    favoriteIds?: string[];
    
    // Audit fields
    createdBy?: string;
    createdOn?: string;
    modifiedBy?: string;
    modifiedOn?: string;
}