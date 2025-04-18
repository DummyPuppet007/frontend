import { SalesOrder, SalesOrderList, BasicSalesOrderUpdate, PaymentSalesOrderUpdate, ProductionSalesOrderUpdate, CreateSalesOrderPayload } from "@/utils/types/sales.types";
import { FetchData } from "./FetchData";
import { generateQueryParamsForDate } from "@/lib/utils";

export async function createNewSalesOrder(data: CreateSalesOrderPayload) {
  const response = await FetchData<SalesOrder>({
    url: "sales/create-salesorder",
    method: "POST",
    data: data,
  });

  if (!response.data) {
    return {
      success: false,
      statusCode: 400,
      message: response.message || "Failed to create sales order.",
      data: null,
    };
  }

  return {
    success: response.success,
    statusCode: response.statusCode,
    message: response.message || "Sales order created successfully.",
    data: response.data,
  };
}

export const getAllSalesOrderList = async (fromDate?: Date, toDate?: Date) => {
  try {
    let url: string = "sales/get-all-sales-orders";

    url = generateQueryParamsForDate(url, fromDate, toDate);

    const response = await FetchData<SalesOrderList[]>({
      url,
      method: "GET",
    });

    if (!response.data) {
      return {
        success: false,
        statusCode: 400,
        message: response.message || "Internal Server Error.",
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

export const getCompleteSalesOrderDetail = async (soId: number) => {
  try {
    const response = await FetchData<SalesOrder>({
      url: `sales/get-complete-sales-order-details/${soId}`,
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
  } catch (error) {
    throw error;
  }
}

export const updateSalesOrderDetails = async (soId: number, data: BasicSalesOrderUpdate | PaymentSalesOrderUpdate | ProductionSalesOrderUpdate | string, section: string) => {
  try {
    if (section !== "basic" && section !== "payment" && section !== "production" && section !== "status") {
      return {
        success: false,
        statusCode: 400,
        message: "Invalid section.",
        data: null,
      };
    }

    let response;


    if (section === "basic") {
      response = await FetchData<SalesOrder>({
        url: `sales/update-sales-order-by-sales-order-id/${soId}`,
        method: "PUT",
        data: data as BasicSalesOrderUpdate,
      });
    } else if (section === "payment") {
      response = await FetchData<SalesOrder>({
        url: `sales/update-sales-order-by-sales-order-id/${soId}`,
        method: "PUT",
        data: data as PaymentSalesOrderUpdate,
      });
    } else if (section === "production") {
      console.log(data);
      response = await FetchData<SalesOrder>({
        url: `production/update-production-details`,
        method: "PUT",
        data: data as ProductionSalesOrderUpdate,
      });
    } else{
      response = await FetchData<SalesOrder>({
        url: `sales/update-sales-order-by-sales-order-id/${soId}`,
        method: "PUT",
        data: {orderStatus: data},
      });
    }

    if (!response.data) {
      return {
        success: false,
        statusCode: 400,
        message: response.message || "Internal Server Error.",
        data: null,
      };
    }

    return {
      success: response.success,
      statusCode: response.statusCode,
      data: response.data,
      message: response.message,
    };
  } catch (error: any) {
    return {
      success: false,
      statusCode: 500,
      message: error.message || "Internal Server Error.",
      data: null,
    }
  }
}