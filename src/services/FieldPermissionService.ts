import { FieldPermissionData, FieldPermissionResponse, FieldPermissions } from "@/types/fieldpermission.type";
import { FetchData, FetchDataResponse } from "./FetchData";

export async function addFieldPermission(data: FieldPermissionData): Promise<FetchDataResponse<FieldPermissionResponse>> {
    const response = await FetchData<FieldPermissionResponse>({
        url: "auth/create-field-permissions",
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

export async function getAllFieldPermissions(): Promise<FetchDataResponse<FieldPermissions[]>> {
    const response = await FetchData<FieldPermissions[]>({
        url: "auth/get-all-field-permissions",
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