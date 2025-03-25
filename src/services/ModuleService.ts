import { ModuleData, ModuleList, ModuleServiceResponse } from "@/types/module.type";
import { FetchData, FetchDataResponse } from "./FetchData";


export async function addModule(data: ModuleData): Promise<FetchDataResponse<ModuleServiceResponse>> {
    const response = await FetchData<ModuleServiceResponse>({
        url: "auth/create-module",
        method: "POST",
        data: data,
    });

    if (!response.data) {
        return {
            success: false,
            statusCode: 400,
            message: "Response is Empty.",
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

export async function getModules(): Promise<FetchDataResponse<ModuleList[]>> {
    const response = await FetchData<ModuleList[]>({
        url: "auth/get-all-modules",
        method: "GET",
    });

    if (!response.data) {
        return {
            success: false,
            statusCode: 400,
            message: "Response is Empty.",
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

export async function editModule(id: number, data: ModuleData): Promise<FetchDataResponse<ModuleServiceResponse>> {
    const response = await FetchData<ModuleServiceResponse>({
        url: `edit-module/${id}`,
        method: "PUT",
        data: data
    });

    if (!response.data) {
        return {
            success: false,
            statusCode: 400,
            message: "Response is Empty.",
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

export async function deleteModule(id:number): Promise<FetchDataResponse<ModuleServiceResponse>>{
    const response = await FetchData<ModuleServiceResponse>({
            url: `delete-module/${id}`,
            method: "DELETE",
        });
    
        if (!response || !response.success) {
            return {
                success: false,
                statusCode: 400,
                message: "Failed to delete module.Response is Empty.",
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