import { FetchData, FetchDataResponse } from "./FetchData";
import { UserData } from "@/types/user.type";
import { User } from "@/stores/useAuthStore";
import { UserServiceResponse } from "@/types/user.type";

export async function registerUser(data: UserData): Promise<FetchDataResponse<UserServiceResponse>> {

    const response = await FetchData<UserServiceResponse>({
        url: "auth/register",
        method: "POST",
        data: data,
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
        message: response.message,
        data: response.data,
    };
}

export async function editUser(data: UserData): Promise<FetchDataResponse<UserServiceResponse>> {

    const response = await FetchData<UserServiceResponse>({
        url: "auth/edit-user",
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
        message: response.message,
        data: response.data,
    };
}

export async function getUserDetail(id: number): Promise<FetchDataResponse<UserData>> {
    const response = await FetchData<UserData>({
        url: `auth/get-user/${id}`,
        method: "GET"
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
        message: response.message,
        data: response.data,
    };
}

export async function getAllUsers(): Promise<FetchDataResponse<UserData[]>> {
    const response = await FetchData<UserData[]>({
        url: "auth/get-all-users",
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

export async function checkUserLoggedIn(): Promise<FetchDataResponse<User>> {
    const response = await FetchData<User>({
        url: "auth/refresh-token",
        method: "POST",
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
        message: response.message,
        data: response.data,
    };
}