// ─── API Wrapper ────────────────────────────────────────────
// Every backend response is wrapped in ApiResponse<T>
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ─── Pagination ─────────────────────────────────────────────
export interface PaginatedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}

// ─── Auth ────────────────────────────────────────────────────
export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ─── User ────────────────────────────────────────────────────
export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

// ─── Product ─────────────────────────────────────────────────
export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  createdAt: string;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
}

// ─── Cart ────────────────────────────────────────────────────
export interface CartItemResponse {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
}

export interface CartResponse {
  id: number;
  userId: number;
  items: CartItemResponse[];
  totalPrice: number;
  totalItems: number;
}

export interface CartRequest {
  productId: number;
  quantity: number;
}

// ─── Order ───────────────────────────────────────────────────
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderResponse {
  id: number;
  userId: number;
  userName: string;
  items: OrderItemResponse[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderRequest {
  address: string;
  city: string;
  phone: string;
}