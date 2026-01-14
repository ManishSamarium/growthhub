import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

// Async thunks
export const fetchJournalEntries = createAsyncThunk(
  'journal/fetchEntries',
  async ({ startDate, endDate, search }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (search) params.append('search', search);

      const response = await axios.get(
        `/journal/fetch?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createJournalEntry = createAsyncThunk(
  'journal/createEntry',
  async (entryData, { rejectWithValue }) => {
    try {
      console.log('📡 API Call - Creating journal entry:', entryData);
      
      const response = await axios.post(
        `/journal/create`,
        entryData
      );
      
      console.log('✅ API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ API Error:', error);
      console.error('📛 Error response:', error.response);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateJournalEntry = createAsyncThunk(
  'journal/updateEntry',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/journal/update/${id}`,
        updates
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteJournalEntry = createAsyncThunk(
  'journal/deleteEntry',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/journal/delete/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchJournalEntryById = createAsyncThunk(
  'journal/fetchEntryById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/journal/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice
const journalSlice = createSlice({
  name: 'journal',
  initialState: {
    entries: [],
    currentEntry: null,
    loading: false,
    error: null,
    searchTerm: '',
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    clearCurrentEntry: (state) => {
      state.currentEntry = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch entries
      .addCase(fetchJournalEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJournalEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchJournalEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create entry
      .addCase(createJournalEntry.fulfilled, (state, action) => {
        state.entries.unshift(action.payload);
      })
      .addCase(createJournalEntry.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update entry
      .addCase(updateJournalEntry.fulfilled, (state, action) => {
        const index = state.entries.findIndex((e) => e._id === action.payload._id);
        if (index !== -1) {
          state.entries[index] = action.payload;
        }
        if (state.currentEntry?._id === action.payload._id) {
          state.currentEntry = action.payload;
        }
      })
      .addCase(updateJournalEntry.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete entry
      .addCase(deleteJournalEntry.fulfilled, (state, action) => {
        state.entries = state.entries.filter((e) => e._id !== action.payload);
        if (state.currentEntry?._id === action.payload) {
          state.currentEntry = null;
        }
      })
      .addCase(deleteJournalEntry.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch entry by ID
      .addCase(fetchJournalEntryById.fulfilled, (state, action) => {
        state.currentEntry = action.payload;
      })
      .addCase(fetchJournalEntryById.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setSearchTerm, clearCurrentEntry, clearError } = journalSlice.actions;
export default journalSlice.reducer;
