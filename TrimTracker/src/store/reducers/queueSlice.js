// ============================================
// store/reducers/queueSlice.js — Queue State
//
// Customer-oda queue status manage pannuvom.
//
// Inga irukka data:
//   - queueStatus: Live queue info (position, wait time, salon name)
//   - loading: Queue data fetch aagudha
//   - error: Enna problem vanthuchu
//
// Inga irukka actions:
//   - setQueueStatus: Queue data set pannuvom
//   - clearQueueStatus: Queue-la illa-na clear
//   - setQueueLoading: Loading on/off
//   - setQueueError: Error message set
// ============================================

import { createSlice } from "@reduxjs/toolkit";

// ---- Initial State ----
const initialState = {
  queueStatus: null, // { position, estimatedWait, salonName, service }
  loading: false,
  error: null,
};

// ---- Create Slice ----
const queueSlice = createSlice({
  name: "queue", // Store-la "queue" nu theriyum

  initialState,

  reducers: {

    // Queue data API-la vandhucha set pannuvom
    // action.payload = { position: 3, estimatedWait: 15, salonName: "...", ... }
    setQueueStatus: (state, action) => {
      state.queueStatus = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Queue cancel pannaa or complete aana clear pannuvom
    clearQueueStatus: (state) => {
      state.queueStatus = null;
      state.loading = false;
      state.error = null;
    },

    // Loading state
    setQueueLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Error message
    setQueueError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// ---- Export Actions ----
export const {
  setQueueStatus,
  clearQueueStatus,
  setQueueLoading,
  setQueueError,
} = queueSlice.actions;

// ---- Export Reducer ----
export default queueSlice.reducer;
