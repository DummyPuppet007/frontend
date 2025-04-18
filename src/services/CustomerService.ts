import { CustomerData, CustomerResponse } from "@/types/customer.type";
import { FetchData, FetchDataResponse } from "./FetchData";

export async function createCustomer(data: CustomerData): Promise<FetchDataResponse<CustomerResponse>> {
    const response = await FetchData<CustomerResponse>({
        url: "customer/create-customer",
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

export async function getAllCustomers(): Promise<FetchDataResponse<CustomerData[]>> {
    const response = await FetchData<CustomerData[]>({
        url: "customer/get-all-customers",
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

export async function editCustomer(id: number, data: CustomerData): Promise<FetchDataResponse<CustomerResponse>> {
    const response = await FetchData<CustomerResponse>({
        url: `customer/update-customer/${id}`,
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

export async function getCustomerDetail(id: number): Promise<FetchDataResponse<CustomerData>> {
    const response = await FetchData<CustomerData>({
        url: `customer/get-customer-by-id/${id}`,
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

export async function getCountriesByName(name: string): Promise<FetchDataResponse<any>> {
    const response = await FetchData<any>({
        url: `customer/get-country-list/search?search=${name}`,
        method: "GET",
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

export async function getStatesByName(countryID: number, name: string): Promise <FetchDataResponse<any>>{
    const response = await FetchData<any>({
        url: `customer/get-state-list/search?countryId=${countryID}&search=${name}`,
        method: "GET",
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

export async function getCitiesByName(stateId: number, name: string): Promise <FetchDataResponse<any>>{
    const response = await FetchData<any>({
        url: `customer/get-city-list/search?stateId=${stateId}$search=${name}`,
        method: "GET",
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