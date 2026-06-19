import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllProductsApi, getProductByIdApi, searchProductsApi } from '../api/productApi';
import type { ProductResponse, PaginatedResponse } from '../types';

interface ProductState {
  products: ProductResponse[];
  selectedProduct: ProductResponse | null;
  totalPages: number;
  totalElements: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  loading: false,
  error: null,
};

// ─── Thunks ──────────────────────────────────────────────────

export const fetchProducts = createAsyncThunk(
  'product/fetchAll',
  async (
    params: { page?: number; size?: number; sortBy?: string; sortDir?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await getAllProductsApi(params);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'product/search',
  async (
    params: { keyword?: string; category?: string; page?: number; size?: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await searchProductsApi(params);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Search failed');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'product/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await getProductByIdApi(id);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Product not found');
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
    clearProductError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePaginated = (
      state: ProductState,
      action: { payload: PaginatedResponse<ProductResponse> }
    ) => {
      state.loading = false;
      state.products = action.payload.content;
      state.totalPages = action.payload.totalPages;
      state.totalElements = action.payload.totalElements;
      state.currentPage = action.payload.pageNumber;
    };

    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, handlePaginated)
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(searchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(searchProducts.fulfilled, handlePaginated)
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchProductById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedProduct, clearProductError } = productSlice.actions;
export default productSlice.reducer;