import { SalesPersonData, SalesPersonResponse } from "@/types/salesorder.type";
import { FetchData, FetchDataResponse } from "./FetchData";

export async function createSalesPerson(data: SalesPersonData):Promise<FetchDataResponse<SalesPersonResponse>>{
    const response = await FetchData<SalesPersonResponse>({
            url: "sales/create-sales-person",
            method: "POST",
            data: data,
        });
    
        if (!response.data) {
            return {
                success: false,
                statusCode: 400,
                message: "Response is Empty - "+response.message,
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

export async function getAllSalesPersons():Promise<FetchDataResponse<SalesPersonData[]>>{
    const response = await FetchData<SalesPersonData[]>({
        url: "sales/get-all-sales-persons",
        method: "GET",
    });

    if (!response.data) {
        return {
            success: false,
            statusCode: 400,
            message: "Response is Empty - "+response.message,
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