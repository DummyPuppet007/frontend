import { generateQueryParamsForDate } from "@/lib/utils";
import { FetchData, FetchDataResponse } from "./FetchData";
import { Production, ProductionList } from "@/utils/types/production.types";
import { MachineModelData, MachineTypeData, MakeData, PowerRatingData, ProductionResponse } from "@/types/production.type";



export const getAllProductionList = async (fromDate?: Date, toDate?: Date) => {
    try {
      let url: string = "production/get-production-details-list";
  
      url = generateQueryParamsForDate(url, fromDate, toDate);
  
      const response = await FetchData<ProductionList[]>({
        url,
        method: "GET",
      });
  
      if (!response.data) {
        return {
          success: false,
          statusCode: 400,
          message: response.message || "Response is Empty.",
          data: [],
        };
      }
  
      return {
        success: response.success,
        statusCode: response.statusCode,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      throw error;
    }
};

export const updateProductionProgress = async (productionId: number, data: { currentProgress: number; comments?: string | null }) => {
  try {
    const response = await FetchData({
      url: `production/update-production-progress/${productionId}`,
      method: "PUT",
      data,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const getProductionDetailsByProductionId = async (productionId: number) => {
  try{
    const response = await FetchData<Production>({
      url: `production/get-production-detail-by-production-id/${productionId}`,
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
  }catch (error) {
    throw error;
  }
}


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

export async function getAllMachineTypes(): Promise<FetchDataResponse<MachineTypeData[]>> {
    const response = await FetchData<MachineTypeData[]>({
        url: "production/get-all-machine-types",
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

export async function getAllMachineModels(): Promise<FetchDataResponse<MachineModelData[]>> {
    const response = await FetchData<MachineModelData[]>({
        url: "production/get-all-machine-models",
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

export async function getAllMakes(): Promise<FetchDataResponse<MakeData[]>> {
    const response = await FetchData<MakeData[]>({
        url: "production/get-all-makes",
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

export async function getAllPowerRatings(): Promise<FetchDataResponse<PowerRatingData[]>> {
    const response = await FetchData<PowerRatingData[]>({
        url: "production/get-all-power-ratings",
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
//***************************** < POWER RATING SECTION > *****************************//P