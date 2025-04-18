const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type FetchDataVariable = {
    url: string;
    method?: string;
    data?: any;
    headers?: HeadersInit;
};

export type FetchDataResponse<T> = {
    success : boolean;
    statusCode: number;
    message: string;
    data: T | null;
};

export async function FetchData<T>({
    url,
    method = "GET",
    data = null,
    headers = { "Content-Type": "application/json" },

}: FetchDataVariable): Promise<FetchDataResponse<T>> { 
    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method,
            headers,
            body: data ? JSON.stringify(data) : null,
            credentials : "include",
            
        });

       
        if (!response.ok) { 
            const errorData = await response.json();

            return {
                success : false,
                statusCode: errorData.statusCode,
                message: errorData.message,
                data: null,
            };
        }

        const responseData = await response.json();
        // console.log(responseData);
        return {
            success : responseData.success,
            statusCode: 200,
            message: responseData.message,
            data: responseData.data,
        };
    } catch (error) {     
        return {    
            success : false,
            statusCode: 500,
            message: "Internal Server Error",
            data: null,
        };
    }
}