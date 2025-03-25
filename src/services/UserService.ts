import { UserData, UserServiceResponse } from "@/types/user.type";
import { FetchData, FetchDataResponse } from "./FetchData";

export async function registerUser(data: UserData) : Promise<FetchDataResponse<UserServiceResponse>> {
   
    const response = await FetchData<UserServiceResponse>({
        url: "auth/register",
        method: "POST",
        data: data,
    });

    if(!response.data){
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
        message: response.message || "User registered successfully.",
        data: response.data, 
    };
}

export async function editUser(id : number, data : UserData) : Promise <FetchDataResponse<UserServiceResponse>> {   
   
    const response = await FetchData<UserServiceResponse>({
        url : `auth/edit-user/${id}`,
        method : "PUT",
        data: data
    });

    if(!response.data){
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
        message: response.message || "User updated successfully.",
        data: response.data, 
    };
}

export async function getUserDetail(id : number ) : Promise <FetchDataResponse<UserData>> {
    const response = await FetchData<UserData>({
        url : `auth/get-user/${id}`,
        method : "GET"
    });

    if(!response.data){
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
        message: response.message || "Data successfully Retrived.",
        data: response.data, 
    };
}

export async function getAllUsers() : Promise<FetchDataResponse<UserData[]>> {
    const response = await FetchData<UserData[]>({
            url: "auth/get-all-users", 
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
