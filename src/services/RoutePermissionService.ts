import { RoutePermissionData, RoutePermissionList, RoutePermissionResponse } from "@/types/routepermission.type";
import { FetchData, FetchDataResponse } from "./FetchData";

export async function addRoutePermission(data : RoutePermissionData) : Promise<FetchDataResponse<RoutePermissionResponse>> {
    const response = await FetchData<RoutePermissionResponse>({
            url: "auth/route-permissions",
            method: "POST",
            data: data,
        });
    
        if (!response.data) {
            return {
                success: false,
                statusCode: 400,
                message: "Response is Empty - Failed to add user permission.",
                data: null,
            };
        }
    
        return {
            success: response.success,
            statusCode: response.statusCode,
            data: response.data,
            message: response.message,
        };
}

export async function getAllRoutePermissions(): Promise<FetchDataResponse<RoutePermissionList[]>>{
     const response = await FetchData<RoutePermissionList[]>({
            url: "auth/get-all-routes-permissions",
            method: "GET",
        });
    
        if (!response.data) {
            return {
                success: false,
                statusCode: 400,
                message: "Response is Empty - Failed to get all route permissions.",
                data: null,
            };
        }
    
        return {
            success: response.success,
            statusCode: response.statusCode,
            data: response.data,
            message: response.message,
        };
}