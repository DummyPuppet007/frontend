import { RolePermissionData, RolePermissionList, RolePermissionResponse } from "@/types/rolepermission.type";
import { FetchData, FetchDataResponse } from "./FetchData";

export async function addRolePermission(data: RolePermissionData): Promise<FetchDataResponse<RolePermissionResponse>> {
    const response = await FetchData<RolePermissionResponse>({
        url: "auth/add-role-permission",
        method: "POST",
        data: data,
    });

    if (!response.data) {
        return {
            success: false,
            statusCode: 400,
            message: "Response is Empty - Failed to add role permission.",
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

export async function getAllRolePermissions(): Promise<FetchDataResponse<RolePermissionList[]>>{
    const response = await FetchData<RolePermissionList[]>({
            url: "auth/get-role-permissions",
            method: "GET",
        });
    
        if (!response.data) {
            return {
                success: false,
                statusCode: 400,
                message: "Response is Empty - Failed to get all role permissions.",
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