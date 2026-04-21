// ============================================
// main.jsx — App Entry Point
//
// OLD: <AppProvider> (useContext) → wrap panninom
// NEW: <Provider store={store}> (Redux) → wrap pannrom!
//
// Provider = Redux store-a ellaa components-kum share pannum
// Ippo enga component-la irundhum useSelector, useDispatch use
// panna mudiyum!
// ============================================

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Redux import
import { Provider } from "react-redux";
import store from "./store/store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* OLD: <AppProvider> → useContext wrapper */}
    {/* NEW: <Provider store={store}> → Redux wrapper! */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
