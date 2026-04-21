//====
// middleware/authenticate.js
// Protected route middleware — Token valid-a check pannuvom
// Router-la verifyToken use panna, idha middle-la pottu use pannuvom
//
// How it works:
//   Request comes in
//   → middleware token check pannuvom
//   → Valid = next() call pannuvom (route proceed aagum)
//   → Invalid = 401 error return pannuvom
//====

import authHelpers from "../helpers/auth.js";
import { StatusCodes } from "http-status-codes";

export const authenticate = (req, res, next) => {
  // Header-la "Authorization: Bearer <token>" irukanum
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Access denied. No token provided.",
    });
  }

  // "Bearer abc123" → token = "abc123"
  const token = authHeader.split(" ")[1];

  try {
    // Token-a verify pannuvom — valid-a irunthaa decoded data return aagum
    const decoded = authHelpers.verifyToken(token);

    // req.user-la userId and role store pannuvom
    // So controller-la req.user.userId use pannalaam
    req.user = decoded;
    next(); // Continue to route handler
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Invalid or expired token.",
    });
  }
};

// ---- Role-based access: Only 'owner' can access ----
// Usage: router.post("/", authenticate, authorizeOwner, controller)
export const authorizeOwner = (req, res, next) => {
  if (req.user.role !== "owner") {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: "Access denied. Only salon owners can do this.",
    });
  }
  next();
};

// ---- Role-based access: Only 'customer' can access ----
// Owner-ala queue join panna mudiyathu!
export const authorizeCustomer = (req, res, next) => {
  if (req.user.role !== "customer") {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: "Owners cannot join the queue. Only customers can book.",
    });
  }
  next();
};
