import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCartApi,
  addToCartApi,
  updateCartItemApi,
  removeCartItemApi,
  clearCartApi,
} from '../api/cartApi';
import type { CartResponse, CartRequest } from '../types';

interface CartState {
  cart: CartResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

// ─── Thunks ──────────────────────────────────────────────────

export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCartApi();
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/add',
  async (data: CartRequest, { rejectWithValue }) => {
    try {
      const res = await addToCartApi(data);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/update',
  async ({ itemId, productId, quantity }: { itemId: number; productId: number; quantity: number }, { rejectWithValue }) => {
    try {
      const res = await updateCartItemApi(itemId, productId, quantity);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update cart');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/remove',
  async (itemId: number, { rejectWithValue }) => {
    try {
      const res = await removeCartItemApi(itemId);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove item');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clear',
  async (_, { rejectWithValue }) => {
    try {
      await clearCartApi();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to clear cart');
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const setCart = (state: CartState, action: { payload: CartResponse }) => {
      state.loading = false;
      state.cart = action.payload;
    };

    const setPending = (state: CartState) => {
      state.loading = true;
      state.error = null;
    };

    const setError = (state: CartState, action: { payload: unknown }) => {
      state.loading = false;
      state.error = action.payload as string;
    };

    builder
      .addCase(fetchCart.pending, setPending)
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(fetchCart.rejected, setError);

    builder
      .addCase(addToCart.pending, setPending)
      .addCase(addToCart.fulfilled, setCart)
      .addCase(addToCart.rejected, setError);

    builder
      .addCase(updateCartItem.pending, setPending)
      .addCase(updateCartItem.fulfilled, setCart)
      .addCase(updateCartItem.rejected, setError);

    builder
      .addCase(removeFromCart.pending, setPending)
      .addCase(removeFromCart.fulfilled, setCart)
      .addCase(removeFromCart.rejected, setError);

    builder
      .addCase(clearCart.pending, setPending)
      .addCase(clearCart.fulfilled, (state) => { state.loading = false; state.cart = null; })
      .addCase(clearCart.rejected, setError);
  },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;