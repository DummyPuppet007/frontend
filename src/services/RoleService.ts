import { FetchData, FetchDataResponse } from "./FetchData";
import { RoleFormData, RoleList } from "@/types/role.type";

export type RoleResponse = {
    data : any;
}

export async function getRoles(): Promise<FetchDataResponse<RoleList[]>> {
    const response = await FetchData<RoleList[]>({
        url: "auth/get-all-roles", 
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

export async function createRole(data : RoleFormData) : Promise<FetchDataResponse<RoleResponse>> { 
    const response = await FetchData<RoleResponse>({
        url: "auth/create-role",
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