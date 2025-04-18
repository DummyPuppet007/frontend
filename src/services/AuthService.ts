import { LoginRequest } from "@/utils/types/auth.types";
import { FetchData, FetchDataResponse } from "./FetchData";
import { User } from "@/stores/useAuthStore";

export async function login(
  data: LoginRequest
): Promise<FetchDataResponse<User | null>> {
  try {
    const response = await FetchData<User>({
      url: "auth/login",
      method: "POST",
      data: data,
    });

    if (!response.data) {
      return {
        success: false,
        statusCode: response.statusCode,
        message: response.message,
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
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    };
  }
}

export async function logout(): Promise<
  FetchDataResponse<null>
> {
  const response = await FetchData<null>({
    url: "auth/logout",
    method: "POST",
  });

  if (!response.success || response.statusCode >= 300) {
    return {
      success: false,
      statusCode: 400,
      message: "Logout failed.",
      data: null,
    };
  }

  return response;
}

export type CurrentUserResponse = {
  id: string;
  role: string;
};

export async function getCurrentUser(): Promise<
  FetchDataResponse<CurrentUserResponse>
> {
  const response = await FetchData<CurrentUserResponse>({
    url: "user",
    method: "GET",
  });

  if (!response.data) {
    return {
      success: false,
      statusCode: 400,
      message: "Failed to fetch user data.",
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
