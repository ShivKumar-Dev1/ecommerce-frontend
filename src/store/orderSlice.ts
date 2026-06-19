import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  placeOrderApi,
  getMyOrdersApi,
  getOrderByIdApi,
  cancelOrderApi,
} from '../api/orderApi';
import type { OrderRequest, OrderResponse, PaginatedResponse } from '../types';

interface OrderState {
  orders: OrderResponse[];
  selectedOrder: OrderResponse | null;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  placing: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  placing: false,
  error: null,
};

// ─── Thunks ──────────────────────────────────────────────────

export const placeOrder = createAsyncThunk(
  'order/place',
  async (data: OrderRequest, { rejectWithValue }) => {
    try {
      const res = await placeOrderApi(data);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to place order');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'order/fetchMine',
  async (params: { page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const res = await getMyOrdersApi(params);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'order/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await getOrderByIdApi(id);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Order not found');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'order/cancel',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await cancelOrderApi(id);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to cancel order');
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearSelectedOrder(state) {
      state.selectedOrder = null;
    },
    clearOrderError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Place Order
    builder
      .addCase(placeOrder.pending, (state) => { state.placing = true; state.error = null; })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placing = false;
        state.orders.unshift(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placing = false;
        state.error = action.payload as string;
      });

    // Fetch My Orders
    builder
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyOrders.fulfilled, (state, action: { payload: PaginatedResponse<OrderResponse> }) => {
        state.loading = false;
        state.orders = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.pageNumber;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch By ID
    builder
      .addCase(fetchOrderById.pending, (state) => { state.loading = true; })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Cancel Order
    builder
      .addCase(cancelOrder.pending, (state) => { state.loading = true; })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map((o) =>
          o.id === action.payload.id ? action.payload : o
        );
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedOrder, clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;