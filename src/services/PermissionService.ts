import { PermissionData, PermissionList, PermissionServiceResponse } from "@/types/permission.type";
import { FetchData, FetchDataResponse } from "./FetchData";

export async function addPermission(data: PermissionData): Promise<FetchDataResponse<PermissionServiceResponse>> {
    const response = await FetchData<PermissionServiceResponse>({
        url: "auth/add-permission",
        method: "POST",
        data: data,
    });

    if (!response.data) {
        return {
            success: false,
            statusCode: 400,
            message: "Response is Empty - Failed to add permission.",
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

export async function getAllPermission(): Promise<FetchDataResponse<PermissionList[]>> {
    const response = await FetchData<PermissionList[]>({
        url: "auth/get-all-permissions",
        method: "GET",
    });

    if (!response.data) {
        return {
            success: false,
            statusCode: 400,
            message: "Response is Empty - Failed to get all permissions.",
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

export async function getPermission(id: number): Promise<FetchDataResponse<PermissionList>> {
    const response = await FetchData<PermissionList>({
        url: `auth/get-permission/${id}`,
        method: "GET",
    });

    if (!response.data) {
        return {
            success: false,
            statusCode: 400,
            message: "Response is Empty - Failed to get permission detail.",
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

export async function editPermission(id: number, data: PermissionData): Promise<FetchDataResponse<PermissionServiceResponse>> { 
    const response = await FetchData<PermissionServiceResponse>({
        url: `edit-permission/${id}`,
        method: "PUT",
        data: data
    });

    if (!response.data) {
        return {
            success: false,
            statusCode: 400,
            message: "Response is Empty - Failed to edit permission",
            data: null,
        }
    }

    return {
        success: response.success,
        statusCode: response.statusCode,
        message: response.message || "Module updated successfully.",
        data: response.data,
    };
}

export async function deletePermission(id: number): Promise<FetchDataResponse<PermissionServiceResponse>> {
    const response = await FetchData<PermissionServiceResponse>({
        url: `delete-permission/${id}`,
        method: "DELETE",
    });

    if (!response || !response.success) {
        return {
            success: false,
            statusCode: 400,
            message: "Response is Empty - Failed to delete module.",
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

