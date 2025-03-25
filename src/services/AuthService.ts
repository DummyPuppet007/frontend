import { FetchData, FetchDataResponse } from "./FetchData";

export type LoginResponse = {
    userId : number;
    roleId : number;
};


export async function login(
    data: any
): Promise<FetchDataResponse<LoginResponse>> {
    
    const response = await FetchData<LoginResponse>({
        url: "auth/login",
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
        message: response.message
    };
}

export async function logout(): Promise<FetchDataResponse<{ message: string }>> {
    const response = await FetchData<{ message: string }>({
        url: "logout",
        method: "POST",
    });

    if (!response.data) {
        return {
            success: false,
            statusCode: 400,
            message: "Logout failed.",
            data: null,
        };
    }

    return {
        success: response.success,
        statusCode: response.statusCode,
        data: response.data,
        message: response.message
    };
}

export type CurrentUserResponse = {
    id: string;
    role: string;
};

export async function getCurrentUser(): Promise<FetchDataResponse<CurrentUserResponse>> {
    const response = await FetchData<CurrentUserResponse>({
        url: "user",
        method: "GET",
    });

    if (!response.data) {
        return {
            success: false,
            statusCode: 400,
            message: "Failed to fetch user data.",
            data: null,
        };
    }

    return {
        success : response.success,
        statusCode: response.statusCode,
        data: response.data,
        message: response.message
    };
}