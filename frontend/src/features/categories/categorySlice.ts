import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Category {
  id: number;
  name: string;
}

interface CategoryState {
  list: Category[];
  loading: boolean;
  error: string | null;
}

export const fetchCategories = createAsyncThunk<Category[]>(
  "categories/fetchCategories",
  async () => {
    try {
      const res = await axios.get<Category[]>(
        "http://localhost:5001/api/categories"
      );
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch categories"
        );
      }
      throw error;
    }
  }
);

const initialState: CategoryState = {
  list: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.list = action.payload;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      });
  },
});

export default categorySlice.reducer;
