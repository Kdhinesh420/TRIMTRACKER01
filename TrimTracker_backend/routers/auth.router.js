//====
// routers/auth.router.js
// Auth (Login & Register) routes with Joi validation
//====

import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { validateSchema } from "../middleware/validate.schema.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

const authRouter = Router();

// ---- /api/auth/register ----
authRouter.post(
  "/register",
  validateSchema(registerSchema), // First input valid-a check pannuvom
  authController.register          // Pinbu logic handle pannuvom
);

// ---- /api/auth/login ----
authRouter.post(
  "/login",
  validateSchema(loginSchema),
  authController.login
);

export default authRouter;