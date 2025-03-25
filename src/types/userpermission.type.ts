export type UserPermissionData = {
    id?: number;
    userId: number;
    permissionId: number;
}

export type UserPermissionResponse = {
    data : any;
}

export type UserPermissionList = {
    id : number;
    userId: number;
    user : any;
    permissionId: number;
    permission : any;
    createdAt: string;
}
