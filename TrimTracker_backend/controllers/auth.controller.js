//====
// controllers/auth.controller.js
// Register & Login handlers
// Unga pattern: named functions → exported as object
//====

import authServices from "../services/auth.services.js";
import authHelpers from "../helpers/auth.js";
import { StatusCodes } from "http-status-codes";

// ---- POST /api/auth/register ----
const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Step 1: Email already used-a check pannuvom
    const existingUser = await authServices.findUserByEmail(email);
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "An account with this email already exists.",
      });
    }

    // Step 2: Create new user
    const result = await authServices.createUser({ name, email, phone, password, role });

    // Step 3: Token generate panni return pannuvom
    const token = authHelpers.generateToken({
      userId: result.insertedId.toString(),
      role: role,
    });

    return res.status(StatusCodes.CREATED).json({
      message: "Account created successfully!",
      token,
      user: { name, email, role }, // Password return pannaamal!
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Registration failed.",
      error: error.message,
    });
  }
};

// ---- POST /api/auth/login ----
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: User exists-a check pannuvom
    const user = await authServices.findUserByEmail(email);
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid email or password.",
      });
    }

    // Step 2: Password match pannuvom
    const isPasswordValid = await authHelpers.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid email or password.",
      });
    }

    // Step 3: Token generate pannuvom
    const token = authHelpers.generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    return res.status(StatusCodes.OK).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Login failed.",
      error: error.message,
    });
  }
};

const authController = {
  register,
  login,
};

export default authController;