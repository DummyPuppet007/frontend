import { FetchData, FetchDataResponse } from "./FetchData";

interface LogFilter {
    logFile: string;
    startDate: string | undefined;
    endDate: string | undefined;
    startTime: string;
    endTime: string;
    page: number;
    limit: number;
}

export async function getLogsFileList(): Promise<FetchDataResponse<string[]>> {
    const response = await FetchData<string[]>({
        url: `logs/files`,
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

export async function getAllLogsDetails(filters: LogFilter): Promise<FetchDataResponse<any>> {
    const response = await FetchData<any>({
        url: `logs/${filters.logFile}`,
        method: "POST",
        data: filters
    });

    // console.log("Response:", response);
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
