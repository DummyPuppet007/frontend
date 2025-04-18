import { FetchData, FetchDataResponse } from "./FetchData";

export interface TotalRevenueType {
    currentTotal: number;
    previousTotal: number;
    percentageChange: number;
}

export async function getTotalRevenue(): Promise<FetchDataResponse<TotalRevenueType>> {
    const response = await FetchData<TotalRevenueType>({
        url: `sales/get-monthly-total-sales`,
        method: "GET",
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

export async function getOpenOrders(): Promise<FetchDataResponse<number>> {
    const response = await FetchData<number>({
        url: `sales/get-open-orders-count`,
        method: "GET",
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


export async function getTotalCustomerCount(): Promise<FetchDataResponse<number>> {
    const response = await FetchData<number>({
        url: `customer/get-customers-count`,
        method: "GET",
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


export async function getPendingProductionCount(): Promise<FetchDataResponse<number>> {
    const response = await FetchData<number>({
        url: `production/get-pending-production-count`,
        method: "GET",
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

export async function getStatusWiseOrderCount(): Promise<FetchDataResponse<any>> {
    const response = await FetchData<any>({
        url: `sales/get-status-wise-order-count`,
        method: "GET",
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

export async function getLast6MonthsData(): Promise<FetchDataResponse<any>> {
    const response = await FetchData<any>({
        url: `sales/get-last-5-months-sales-value`,
        method: "GET",
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

export async function getTopMachineModels(): Promise<FetchDataResponse<any>> {
    const response = await FetchData<any>({
        url: `sales/get-top-sold-machine-models`,
        method: "GET",
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

