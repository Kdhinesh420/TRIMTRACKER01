// ============================================
// store/store.js — Redux Store Configuration
//
// Idhu namma app-oda CENTRAL STORE!
// Ellaa slices (auth, queue) ingayae combine aagum.
//
// Think of it like a BIG OBJECT:
// {
//   auth: { user, token, loading, error },
//   queue: { queueStatus, loading, error },
// }
//
// Any component-la irundhum ithu access panna mudiyum!
// ============================================

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import queueReducer from "./reducers/queueSlice";

// ---- Create Store ----
// configureStore = Redux Toolkit easy way to create store
// (DevTools, middleware, etc. automatic-a setup aagum!)
const store = configureStore({
  reducer: {
    auth: authReducer,   // state.auth → authSlice-oda data
    queue: queueReducer, // state.queue → queueSlice-oda data
  },
});

export default store;
