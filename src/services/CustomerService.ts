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

export async function getAllCustomers(): Promise<FetchDataResponse<CustomerData[]>> {
    const response = await FetchData<CustomerData[]>({
        url: "customer/get-all-customers",
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

export async function getCustomerDetail(id: number): Promise<FetchDataResponse<CustomerData>> {
    const response = await FetchData<CustomerData>({
        url: `customer/get-customer-by-id/${id}`,
        method: "GET"
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
        message: response.message || "Data successfully Retrived.",
        data: response.data,
    };
}

