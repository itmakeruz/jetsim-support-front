import axios from "@/lib/axios";
import { DeliveryStatus } from "@/types/orders";
import { size } from "@/constants/paginationStuffs";
import type { TransferType } from "@/types/transfers";

// Auth API - Exact match from api-data.json
export const authAPI = {
  login: (data: { username: string; password: string }) =>
    axios.post("/auth/login", data),
  logout: () => axios.post("/logout"),
  getProfile: () => axios.get("/users/profile"),
};

// New Orders API for logistics back-end
export const ordersAPI = {
  getOrders: ({
    deliveryStatus,
    page = 1,
  }: {
    deliveryStatus?: DeliveryStatus | string;
    page?: number;
    search?: string;
  }) => {
    const params: Record<string, any> = {
      limit: size,
    };

    if (deliveryStatus) {
      params.deliveryStatus = deliveryStatus;
    }
    if (page > 1) {
      params.page = page;
    }

    return axios.get("/orders", { params });
  },
  getOrder: (id: string) => axios.get(`/orders/${id}`),
};

// Transport Categories API
export const transportCategoriesAPI = {
  getTransportCategories: ({ page = 1 }: { page?: number }) => {
    const params: Record<string, any> = {
      limit: size,
    };

    if (page > 1) {
      params.page = page;
    }

    return axios.get("/transport-types/admin", { params });
  },
  getTransportCategory: (id: string | number) =>
    axios.get(`/transport-types/${id}`),
  createTransportCategory: (data: TransferType | null) =>
    axios.post("/transport-types", data),
  updateTransportCategory: (id: string | number, data: TransferType | null) =>
    axios.patch(`/transport-types/${id}`, data),
  deleteTransportCategory: (id: string | number) =>
    axios.delete(`/transport-types/${id}`),
};

// Order Types (Cargo Types) API
export const orderTypesAPI = {
  getOrderTypes: ({ page = 1 }: { page?: number }) => {
    const params: Record<string, any> = {
      limit: size,
    };

    if (page > 1) {
      params.page = page;
    }

    return axios.get("/order-types/admin", { params });
  },
  getOrderType: (id: string | number) => axios.get(`/order-types/${id}`),
  createOrderType: (data: any) => axios.post("/order-types", data),
  updateOrderType: (id: string | number, data: any) =>
    axios.patch(`/order-types/${id}`, data),
  deleteOrderType: (id: string | number) => axios.delete(`/order-types/${id}`),
};

// Users API
export const usersAPI = {
  getUsers: ({ page = 1 }: { page?: number }) => {
    const params: Record<string, any> = {
      limit: size,
    };

    if (page > 1) {
      params.page = page;
    }

    return axios.get("/customers", { params });
  },
  getUser: (id: string | number) => axios.get(`/customers/${id}`),
  deleteUser: (id: string | number) => axios.delete(`/users/${id}`),
};

// Drivers API
export const driversAPI = {
  getDrivers: ({ page = 1 }: { page?: number }) => {
    const params: Record<string, any> = {
      limit: size,
    };

    if (page > 1) {
      params.page = page;
    }

    return axios.get("/drivers", { params });
  },
  deleteDriver: (id: string | number) => axios.delete(`/drivers/${id}`),
};
