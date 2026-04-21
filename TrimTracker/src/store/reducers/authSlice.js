// ============================================
// store/reducers/authSlice.js — Auth (User) State
//
// Redux Toolkit "slice" = state + actions oru place-la!
//
// Inga irukka data:
//   - user: Login aana user info (name, email, role, etc.)
//   - token: JWT token (backend authentication-ku)
//   - loading: API call nadakkudha illaya
//   - error: Enna error vanthuchu
//
// Inga irukka actions (functions):
//   - loginSuccess: Login success aana user + token save
//   - registerSuccess: Register success aana user + token save
//   - logout: User-a logout panniduvom
//   - setLoading: Loading state on/off
//   - setError: Error message set
//   - clearError: Error-a clear
// ============================================

import { createSlice } from "@reduxjs/toolkit";

// ---- Initial State ----
// App first load aakum bodhu enna value irukkanam
const initialState = {
  // localStorage-la token irunthucha check pannrom
  // (Page refresh aanalum login state maintain aagum)
  user: null,
  token: localStorage.getItem("trimtracker_token") || null,
  loading: false,
  error: null,
};

// ---- Create Slice ----
// createSlice = reducer + actions oru function-la!
const authSlice = createSlice({
  name: "auth", // Slice-oda name (store-la "auth" nu theriyum)

  initialState, // Mela define panna initial values

  // Reducers = State-a maatrura functions
  reducers: {

    // Login success aana call pannuvom
    // action.payload = { user: {...}, token: "xyz" }
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      // Token-a localStorage-la save (page refresh-ku)
      localStorage.setItem("trimtracker_token", action.payload.token);
    },

    // Register success aana call pannuvom (same as login)
    registerSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      localStorage.setItem("trimtracker_token", action.payload.token);
    },

    // Logout — ellathayum clear panniduvom
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("trimtracker_token");
    },

    // Loading state set pannuvom (API call start aagum bodhu)
    setLoading: (state, action) => {
      state.loading = action.payload; // true or false
    },

    // Error message set pannuvom
    setError: (state, action) => {
      state.error = action.payload; // error message string
      state.loading = false;
    },

    // Error-a clear pannuvom
    clearError: (state) => {
      state.error = null;
    },
  },
});

// ---- Export Actions ----
// Components-la use panna: dispatch(loginSuccess({user, token}))
export const {
  loginSuccess,
  registerSuccess,
  logout,
  setLoading,
  setError,
  clearError,
} = authSlice.actions;

// ---- Export Reducer ----
// Store-la register panna: store.js-la use pannuvom
export default authSlice.reducer;
