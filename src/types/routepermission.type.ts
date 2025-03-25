export type RoutePermissionData = {
    id? : number;
    routedId : number;
    permissionId : number;
}

export type RoutePermissionResponse = {
    data : any;
}

export type RoutePermissionList = {
    id : number;
    routeId: number
    route : any;
    permissionId: number;
    permission : any;
    createdAt: string;
}