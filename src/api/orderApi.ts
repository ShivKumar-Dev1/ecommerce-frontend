import axiosInstance from './axiosInstance';
import type { ApiResponse, OrderRequest, OrderResponse, OrderStatus, PaginatedResponse } from '../types';

export const placeOrderApi = (data: OrderRequest) =>
  axiosInstance.post<ApiResponse<OrderResponse>>('/orders', data);

export const getMyOrdersApi = (params?: { page?: number; size?: number }) =>
  axiosInstance.get<ApiResponse<PaginatedResponse<OrderResponse>>>('/orders', { params });

export const getOrderByIdApi = (id: number) =>
  axiosInstance.get<ApiResponse<OrderResponse>>(`/orders/${id}`);

export const cancelOrderApi = (id: number) =>
  axiosInstance.put<ApiResponse<OrderResponse>>(`/orders/${id}/cancel`);

export const getAllOrdersAdminApi = (params?: { page?: number; size?: number }) =>
  axiosInstance.get<ApiResponse<PaginatedResponse<OrderResponse>>>('/orders/all', { params });

export const updateOrderStatusApi = (id: number, status: OrderStatus) =>
  axiosInstance.put<ApiResponse<OrderResponse>>(`/orders/${id}/status`, null, {
    params: { status },
  });