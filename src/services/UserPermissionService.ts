import { UserPermissionData, UserPermissionList, UserPermissionResponse } from "@/types/userpermission.type";
import { FetchData, FetchDataResponse } from "./FetchData";



export async function addUserPermission(data: UserPermissionData): Promise<FetchDataResponse<UserPermissionResponse>> {
    const response = await FetchData<UserPermissionResponse>({
        url: "auth/add-user-permission",
        method: "POST",
        data: data,
    });

    if (!response.data) {
        return {
            success: false,
            statusCode: 400,
            message: response.message || "Response is Empty.",
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

export async function getAllUserPermissions(): Promise<FetchDataResponse<UserPermissionList[]>> {
    const response = await FetchData<UserPermissionList[]>({
        url: "auth/get-user-permissions",
        method: "GET",
    });

    if (!response.data) {
        return {
            success: false,
            statusCode: 400,
            message: response.message || "Response is Empty.",
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