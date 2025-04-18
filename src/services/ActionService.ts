import { ActionData, ActionList, ActionServiceResponse } from "@/types/action.type";
import { FetchData, FetchDataResponse } from "./FetchData";



export async function getActions(): Promise<FetchDataResponse<ActionList[]>> {
    const response = await FetchData<ActionList[]>({
        url: "auth/get-all-actions",
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

export async function createAction(data: ActionData): Promise<FetchDataResponse<ActionServiceResponse>> {
    const response = await FetchData<ActionServiceResponse>({
        url: "auth/create-action",
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

export async function updateAction(data: ActionData): Promise<FetchDataResponse<ActionServiceResponse>>{
    const response = await FetchData<ActionServiceResponse>({
        url: "auth/update-action",
        method: "PUT",
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

export async function deleteAction(id:number): Promise<FetchDataResponse<ActionServiceResponse>>{
    const response = await FetchData<ActionServiceResponse>({
        url: `auth/delete-action/${id}`,
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