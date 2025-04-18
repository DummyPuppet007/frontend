export type FieldPermissionData = {
    userId: number;
    roleId: number;
    resource: string;
    allowedFields: string[];
}

export type searchTableRes = {
    id: number;
    name: string;
    columns: string[];
}

export type FieldPermissions = {
    userId: number;
    roleId: number;
    resource: string;
    allowedFields: string | string[];
    createdAt: string;
    user: any;
    role: any;
}

export type FieldPermissionResponse = {
    data : any;
}