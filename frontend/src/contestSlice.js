import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient';

export const fetchAllContests = createAsyncThunk(
  'contest/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/contest/all');
      return response.data;
    } catch (error) {
      const data = error.response?.data;
      const errorMessage =
        typeof data === 'string'
          ? data
          : data?.message || error.message || 'Failed to fetch contests';
      const errorStatus = error.response?.status || 500;
      return rejectWithValue({ message: errorMessage, status: errorStatus });
    }
  }
);

export const fetchContestById = createAsyncThunk(
  'contest/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/contest/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch contest';
      const errorStatus = error.response?.status || 500;
      return rejectWithValue({ message: errorMessage, status: errorStatus });
    }
  }
);

export const registerForContest = createAsyncThunk(
  'contest/register',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`/contest/${id}/register`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to register';
      const errorStatus = error.response?.status || 500;
      return rejectWithValue({ message: errorMessage, status: errorStatus });
    }
  }
);

export const fetchLeaderboard = createAsyncThunk(
  'contest/fetchLeaderboard',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/contest/${id}/leaderboard`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch leaderboard';
      const errorStatus = error.response?.status || 500;
      return rejectWithValue({ message: errorMessage, status: errorStatus });
    }
  }
);

export const fetchMyRating = createAsyncThunk(
  'contest/fetchMyRating',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/contest/rating');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch rating';
      const errorStatus = error.response?.status || 500;
      return rejectWithValue({ message: errorMessage, status: errorStatus });
    }
  }
);

export const fetchGlobalLeaderboard = createAsyncThunk(
  'contest/fetchGlobalLeaderboard',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1 } = params;
      const response = await axiosClient.get(`/contest/leaderboard/global?page=${page}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch global leaderboard';
      const errorStatus = error.response?.status || 500;
      return rejectWithValue({ message: errorMessage, status: errorStatus });
    }
  }
);

function normalizeContestList(payload) {
  if (!payload) return [];
  return Array.isArray(payload) ? payload : [];
}

const contestSlice = createSlice({
  name: 'contest',
  initialState: {
    contests: [],
    listLoading: false,
    listError: null,
    currentContest: null,
    detailLoading: false,
    detailError: null,
    leaderboard: [],
    leaderboardLoading: false,
    globalLeaderboard: { leaderboard: [], total: 0, page: 1, totalPages: 0 },
    globalLeaderboardLoading: false,
    myRating: null,
    registering: false
  },
  reducers: {
    clearContestSliceErrors: (state) => {
      state.listError = null;
      state.detailError = null;
    },
    clearCurrentContest: (state) => {
      state.currentContest = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllContests.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchAllContests.fulfilled, (state, action) => {
        state.listLoading = false;
        state.contests = normalizeContestList(action.payload);
      })
      .addCase(fetchAllContests.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload?.message || 'Failed to fetch contests';
        state.contests = [];
      })

      .addCase(fetchContestById.pending, (state, action) => {
        state.detailLoading = true;
        state.detailError = null;
        const id = action.meta.arg;
        if (state.currentContest && String(state.currentContest._id) !== String(id)) {
          state.currentContest = null;
        }
      })
      .addCase(fetchContestById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentContest = action.payload;
      })
      .addCase(fetchContestById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload?.message || 'Failed to fetch contest';
        state.currentContest = null;
      })

      .addCase(registerForContest.pending, (state) => {
        state.registering = true;
      })
      .addCase(registerForContest.fulfilled, (state) => {
        state.registering = false;
        if (state.currentContest) {
          state.currentContest.isRegistered = true;
          state.currentContest.participantCount = (state.currentContest.participantCount || 0) + 1;
        }
      })
      .addCase(registerForContest.rejected, (state) => {
        state.registering = false;
      })

      .addCase(fetchLeaderboard.pending, (state) => {
        state.leaderboardLoading = true;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaderboardLoading = false;
        state.leaderboard = normalizeContestList(action.payload);
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.leaderboardLoading = false;
        state.leaderboard = [];
      })

      .addCase(fetchMyRating.fulfilled, (state, action) => {
        state.myRating = action.payload;
      })
      .addCase(fetchMyRating.rejected, (state) => {
        state.myRating = null;
      })

      .addCase(fetchGlobalLeaderboard.pending, (state) => {
        state.globalLeaderboardLoading = true;
      })
      .addCase(fetchGlobalLeaderboard.fulfilled, (state, action) => {
        state.globalLeaderboardLoading = false;
        state.globalLeaderboard = action.payload || state.globalLeaderboard;
      })
      .addCase(fetchGlobalLeaderboard.rejected, (state) => {
        state.globalLeaderboardLoading = false;
      });
  }
});

export const { clearContestSliceErrors, clearCurrentContest } = contestSlice.actions;
export default contestSlice.reducer;
