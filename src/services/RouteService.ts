import { RouteList } from "@/types/route.type";
import { FetchData, FetchDataResponse } from "./FetchData";

export async function getAllRoutes() : Promise <FetchDataResponse<RouteList[]>> {
     const response = await FetchData<RouteList[]>({
            url: "auth/get-all-routes",
            method: "GET",
        });
    
        if (!response.data) {
            return {
                success: false,
                statusCode: 400,
                message: "Response is Empty - Failed to get all routes.",
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