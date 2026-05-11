import authServices from "../services/auth.services.js";
import authHelpers from "../helpers/auth.js";
import { StatusCodes } from "http-status-codes";

// ---- POST /api/auth/register ----
const register = async (req, res) => {
  try {
    // ✅ district destructure pannittom
    const { name, email, phone, password, role, district } = req.body;

    // Step 1: Email already used-a check pannuvom
    const existingUser = await authServices.findUserByEmail(email);
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "An account with this email already exists.",
      });
    }

    // Step 2: Create new user — district also save pannuvom
    const result = await authServices.createUser({
      name,
      email,
      phone,
      password,
      role,
      district, // ✅ DB-la save pannuvom
    });

    // Step 3: Token generate panni return pannuvom
    const token = authHelpers.generateToken({
      userId: result.insertedId.toString(),
      role: role,
    });

    return res.status(StatusCodes.CREATED).json({
      message: "Account created successfully!",
      token,
      user: { name, email, role, district }, // ✅ Response-layum include pannittom
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

    const user = await authServices.findUserByEmail(email);
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await authHelpers.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid email or password.",
      });
    }

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
        district: user.district, // ✅ Login response-layum include pannittom
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
