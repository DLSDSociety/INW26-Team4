import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as userAPI from './userAPI';

export const loadAddresses = createAsyncThunk(
  'user/loadAddresses',
  async (_, { rejectWithValue }) => {
    try { return await userAPI.listAddresses(); }
    catch (e) { return rejectWithValue(e.response?.data?.message); }
  }
);

export const createAddress = createAsyncThunk(
  'user/createAddress',
  async (data, { rejectWithValue }) => {
    try { return await userAPI.addAddress(data); }
    catch (e) { return rejectWithValue(e.response?.data?.message); }
  }
);

export const editAddress = createAsyncThunk(
  'user/editAddress',
  async ({ id, data }, { rejectWithValue }) => {
    try { return await userAPI.updateAddress(id, data); }
    catch (e) { return rejectWithValue(e.response?.data?.message); }
  }
);

export const removeAddress = createAsyncThunk(
  'user/removeAddress',
  async (id, { rejectWithValue }) => {
    try { return await userAPI.deleteAddress(id); }
    catch (e) { return rejectWithValue(e.response?.data?.message); }
  }
);

const slice = createSlice({
  name: 'user',
  initialState: { addresses: [], loading: false, error: null },
  reducers: { clearUserError: (s) => { s.error = null; } },
  extraReducers: (b) => {
    [loadAddresses, createAddress, editAddress, removeAddress].forEach((thunk) => {
      b.addCase(thunk.pending,  (s) => { s.loading = true;  s.error = null; });
      b.addCase(thunk.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
      b.addCase(thunk.fulfilled,(s, a) => { s.loading = false; s.addresses = a.payload; });
    });
  },
});

export const { clearUserError } = slice.actions;
export const selectAddresses = (s) => s.user.addresses;
export const selectDefaultAddress = (s) =>
  s.user.addresses.find((a) => a.isDefault) || null;
export default slice.reducer;

