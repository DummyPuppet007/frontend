import { generateQueryParamsForDate } from "@/lib/utils";
import { FetchData, FetchDataResponse } from "./FetchData";

interface Role {
  roleId: number;
  roleName: string;
}

interface User {
  userId: number;
  username: string;
  firstname: string;
  lastname: string;
  role: Role;
}

interface Subscription {
  user: User;
}

export interface Topic {
  topicId: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  subscriptions: Subscription[];
}

export interface NotificationType {
  notificationId: number;
  topicId: number;
  title: string;
  message: string;
  type: string; // e.g., "success", "error", etc.
  metadata: null | any; // Use `any` if metadata can have dynamic structure
  createdAt: string; // ISO date string
  topic: {
    name: string;
    description: string;
  };
  readBy: {
    userId: number;
  }[];
}

export async function getAllNotificationTopics(
  fromDate?: Date,
  toDate?: Date
): Promise<FetchDataResponse<Topic[]>> {
  let url: string = "notification/topics/all";

  url = generateQueryParamsForDate(url, fromDate, toDate);

  const response = await FetchData<Topic[]>({
    url,
    method: "GET",
  });

  if (!response.data) {
    return {
      success: false,
      statusCode: 400,
      message: response.message,
      data: [],
    };
  }

  return {
    success: response.success,
    statusCode: response.statusCode,
    data: response.data,
    message: response.message,
  };
}

export async function createNewTopic(
  name: string,
  description: string
): Promise<FetchDataResponse<Topic[]>> {
  const response = await FetchData<Topic[]>({
    url: "notification/topics",
    method: "POST",
    data: {
      name,
      description,
    },
  });

  if (!response.data) {
    return {
      success: false,
      statusCode: 400,
      message: response.message,
      data: [],
    };
  }

  return {
    success: response.success,
    statusCode: response.statusCode,
    data: response.data,
    message: response.message,
  };
}

export async function getAllUserNotifications(): Promise<FetchDataResponse<NotificationType[]>> {
  let url: string = "notification/user-notifications";

  const response = await FetchData<NotificationType[]>({
    url,
    method: "GET",  
  });

  if (!response.success || response.statusCode != 200) {
    return {
      success: false,
      statusCode: 400,
      message: response.message,
      data: [],
    };
  }

  return {
    success: response.success,
    statusCode: response.statusCode,
    data: response.data,
    message: response.message,
  };
}

export async function markNotificationRead(id: number): Promise<FetchDataResponse<any>> {
  const response = await FetchData<any>({
    url: `notification/${id}/read`,
    method: "PATCH",
  });

  if (!response.data) {
    return {
      success: false,
      statusCode: 400,
      message: response.message,
      data: [],
    };
  }

  return {
    success: response.success,
    statusCode: response.statusCode,
    data: response.data,
    message: response.message,
  };
}

export async function getUserUnreadNotificationCount(): Promise<FetchDataResponse<any>> {
  const response = await FetchData<any>({
    url: `notification/get-user-unread-notification-count`,
    method: "GET",
  });

  if (!response.data) {
    return {
      success: false,
      statusCode: 400,
      message: response.message,
      data: [],
    };
  }

  return {
    success: response.success,
    statusCode: response.statusCode,
    data: response.data,
    message: response.message,
  };
}
