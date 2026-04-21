//
// routers/AppRouter.jsx
//
// All 9 routes (8 pages + 404) defined here.
// createBrowserRouter = React Router v6 modern way.
//

import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layout (Navbar + Footer wrapper)
import RootLayout from "../layouts/RootLayout";

// All pages
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Salons from "../pages/Salons";
import SalonDetail from "../pages/SalonDetail";
import Queue from "../pages/Queue";
import OwnerDashboard from "../pages/OwnerDashboard";
import SalonSetup from "../pages/SalonSetup";
import HowItWorks from "../pages/HowItWorks";
import NotFound from "../pages/NotFound";

const router = createBrowserRouter([
  {
    // RootLayout wraps all routes = Navbar + Footer on every page
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },           // "/"
      { path: "register", element: <Register /> },       // "/register"
      { path: "login", element: <Login /> },          // "/login"
      { path: "salons", element: <Salons /> },         // "/salons"
      { path: "salons/:id", element: <SalonDetail /> },    // "/salons/abc123"
      { path: "queue", element: <Queue /> },          // "/queue"
      { path: "salon-setup", element: <SalonSetup /> }, // "/salon-setup"
      { path: "owner-dashboard", element: <OwnerDashboard /> }, // "/owner-dashboard"
      { path: "how-it-works", element: <HowItWorks /> },     // "/how-it-works"
      { path: "*", element: <NotFound /> },       // 404 catch-all
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
