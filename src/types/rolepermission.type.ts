export type RolePermissionData = {
    id?: number;
    roleId: number;
    permissionId: number;
};


export type RolePermissionList = {
    id: number;
    roleId: number;
    role: any;
    permissionId: number;
    permission: any;
    createdAt: string;
}

export type RolePermissionResponse = {
    data: any;
}
