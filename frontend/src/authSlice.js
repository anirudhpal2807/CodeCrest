import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient'

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
    const response =  await axiosClient.post('/user/register', userData);
    return response.data.user;
    } catch (error) {
      // Extract only serializable error information
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      const errorStatus = error.response?.status || 500;
      return rejectWithValue({
        message: errorMessage,
        status: errorStatus
      });
    }
  }
);


export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/login', credentials);
      return response.data.user;
    } catch (error) {
      // Extract only serializable error information
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      const errorStatus = error.response?.status || 500;
      return rejectWithValue({
        message: errorMessage,
        status: errorStatus
      });
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get('/user/check');
      return data.user;
    } catch (error) {
      // 401 is expected when user is not logged in - not an error
      if (error.response?.status === 401) {
        return rejectWithValue(null); // Special case for no session
      }
      // Extract only serializable error information
      const errorMessage = error.response?.data?.message || error.message || 'Authentication check failed';
      const errorStatus = error.response?.status || 500;
      return rejectWithValue({
        message: errorMessage,
        status: errorStatus
      });
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post('/user/logout');
      return null;
    } catch (error) {
      // Extract only serializable error information
      const errorMessage = error.response?.data?.message || error.message || 'Logout failed';
      const errorStatus = error.response?.status || 500;
      return rejectWithValue({
        message: errorMessage,
        status: errorStatus
      });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      // Register User Cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        // Handle both old error format and new serializable format
        if (typeof action.payload === 'string') {
          state.error = action.payload;
        } else if (action.payload?.message) {
          state.error = action.payload.message;
        } else {
          state.error = 'Registration failed. Please try again.';
        }
        state.isAuthenticated = false;
        state.user = null;
      })
  
      // Login User Cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        // Handle both old error format and new serializable format
        if (typeof action.payload === 'string') {
          state.error = action.payload;
        } else if (action.payload?.message) {
          state.error = action.payload.message;
        } else {
          state.error = 'Login failed. Please check your credentials.';
        }
        state.isAuthenticated = false;
        state.user = null;
      })
  
      // Check Auth Cases
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        // Handle both old error format and new serializable format
        if (action.payload === null) {
          // Special case for 401 - no session
          state.error = null;
        } else if (typeof action.payload === 'string') {
          state.error = action.payload;
        } else if (action.payload?.message) {
          state.error = action.payload.message;
        } else {
          state.error = 'Authentication check failed.';
        }
        state.isAuthenticated = false;
        state.user = null;
      })
  
      // Logout User Cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        // Handle both old error format and new serializable format
        if (typeof action.payload === 'string') {
          state.error = action.payload;
        } else if (action.payload?.message) {
          state.error = action.payload.message;
        } else {
          state.error = 'Logout failed. Please try again.';
        }
        state.isAuthenticated = false;
        state.user = null;
      });
  }
});

export default authSlice.reducer;