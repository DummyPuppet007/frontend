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

export async function getModules(): Promise<FetchDataResponse<ModuleList[]>> {
    const response = await FetchData<ModuleList[]>({
        url: "auth/get-all-modules",
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

export async function editModule(data: ModuleData): Promise<FetchDataResponse<ModuleServiceResponse>> {
    const response = await FetchData<ModuleServiceResponse>({
        url: "auth/update-module",
        method: "PUT",
        data: data
    });

    if (!response.data) {
        return {
            success: false,
            statusCode: 400,
            message: response.message || "Response is Empty.",
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
            url: `auth/delete-module/${id}`,
            method: "PUT",
        });
    
        if (!response || !response.success) {
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