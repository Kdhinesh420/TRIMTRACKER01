// ============================================================
// layouts/RootLayout.jsx
// Navbar + Page content + Footer — COMMON for all routes.
// Owner dashboard has its own sidebar, so excludes main nav.
// ============================================================

import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RootLayout = () => {
  const location = useLocation();

  // Owner dashboard-la Navbar and Footer not needed
  const isOwnerPanel = location.pathname.startsWith("/owner-dashboard");

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Only show Navbar on non-owner pages */}
      {!isOwnerPanel && <Navbar />}

      {/* flex-1 = Footer is always at bottom */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Only show Footer on non-owner pages */}
      {!isOwnerPanel && <Footer />}
    </div>
  );
};

export default RootLayout;
