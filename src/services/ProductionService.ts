import { MachineModelData, MachineTypeData, MakeData, PowerRatingData, ProductionResponse } from "@/types/production.type";
import { FetchData, FetchDataResponse } from "./FetchData";

//***************************** < MACHINE TYPE SECTION > *****************************//
export async function createMachineType(data: MachineTypeData): Promise<FetchDataResponse<ProductionResponse>> {
    const response = await FetchData<ProductionResponse>({
        url: "production/create-machine-type",
        method: "POST",
        data: data,
    });

    if (!response.data) {
        return {
            success: false,
            statusCode: 400,
            message: "Response is Empty - Failed to create machine type.",
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

export async function getAllMachineTypes(): Promise<FetchDataResponse<MachineTypeData[]>> {
    const response = await FetchData<MachineTypeData[]>({
        url: "production/get-all-machine-types",
        method: "GET",
    });

    if (!response.data) {
        return {
            success: false,
            statusCode: 400,
            message: "Response is Empty - Failed to all fetch machine types.",
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
//***************************** < MACHINE TYPE SECTION > *****************************//


//***************************** < MACHINE MODEL SECTION > *****************************//
export async function createMachineModel(data: MachineModelData): Promise<FetchDataResponse<ProductionResponse>> {
    const response = await FetchData<ProductionResponse>({
        url: "production/create-machine-model",
        method: "POST",
        data: data,
    });

    if (!response.data) {
        return {
            success: false,
            statusCode: 400,
            message: "Response is Empty - Failed to create machine modal.",
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

export async function getAllMachineModels(): Promise<FetchDataResponse<MachineModelData[]>> {
    const response = await FetchData<MachineModelData[]>({
        url: "production/get-all-machine-models",
        method: "GET",
    });

    if (!response.data) {
        return {
            success: false,
            statusCode: 400,
            message: "Response is Empty - Failed to all fetch machine modals.",
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
//***************************** < MACHINE MODAL SECTION > *****************************//


//***************************** < MAKE SECTION > *****************************//
export async function createMake(data: MakeData): Promise<FetchDataResponse<ProductionResponse>> {
    const response = await FetchData<ProductionResponse>({
        url: "production/create-make",
        method: "POST",
        data: data,
    });

    if (!response.data) {
        return {
            success: false,
            statusCode: 400,
            message: "Response is Empty - Failed to create make.",
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

export async function getAllMakes(): Promise<FetchDataResponse<MakeData[]>> {
    const response = await FetchData<MakeData[]>({
        url: "production/get-all-makes",
        method: "GET",
    });

    if (!response.data) {
        return {
            success: false,
            statusCode: 400,
            message: "Response is Empty - Failed to all fetch makes.",
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
//***************************** < MAKE SECTION > *****************************//


//***************************** < POWER RATING SECTION > *****************************//
export async function createPowerRating(data: PowerRatingData): Promise<FetchDataResponse<ProductionResponse>> {
    const response = await FetchData<ProductionResponse>({
        url: "production/create-power-rating",
        method: "POST",
        data: data,
    });

    if (!response.data) {
        return {
            success: false,
            statusCode: 400,
            message: "Response is Empty - Failed to create power rating.",
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

export async function getAllPowerRatings(): Promise<FetchDataResponse<PowerRatingData[]>> {
    const response = await FetchData<PowerRatingData[]>({
        url: "production/get-all-power-ratings",
        method: "GET",
    });

    if (!response.data) {
        return {
            success: false,
            statusCode: 400,
            message: "Response is Empty - Failed to all fetch power ratings.",
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
//***************************** < POWER RATING SECTION > *****************************//