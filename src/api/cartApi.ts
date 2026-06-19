import axiosInstance from './axiosInstance';
import type { ApiResponse, CartRequest, CartResponse } from '../types';

export const getCartApi = () =>
  axiosInstance.get<ApiResponse<CartResponse>>('/cart');

export const addToCartApi = (data: CartRequest) =>
  axiosInstance.post<ApiResponse<CartResponse>>('/cart/add', data);

export const updateCartItemApi = (itemId: number, productId: number, quantity: number) =>
  axiosInstance.put<ApiResponse<CartResponse>>(`/cart/update/${itemId}`, { productId, quantity });  

export const removeCartItemApi = (itemId: number) =>
  axiosInstance.delete<ApiResponse<CartResponse>>(`/cart/remove/${itemId}`);

export const clearCartApi = () =>
  axiosInstance.delete<ApiResponse<null>>('/cart/clear');