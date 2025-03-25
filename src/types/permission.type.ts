export type PermissionList = {
    permissionId: number;
    moduleId: number;
    module: any;
    actionId: number;
    action: any;
    createdAt: string;
}

export type PermissionData = {
    permissionId?: number;
    moduleId: number;
    actionId: number;
};

export type PermissionServiceResponse = {
    data: any;
}

export type Permissions = {
    id: number;
    name : string;
}