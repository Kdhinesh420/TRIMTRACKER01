//====
// schemas/auth.schema.js
// Register & Login form validation — Joi use pannrom
// Unga existing pattern: Joi.object() → export
//====

import Joi from "joi";

// ---- Register validation ----
// User form submit panna, idha match pannuvom
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(60).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
  }),

  email: Joi.string().email().lowercase().trim().required().messages({
    "string.email": "Enter a valid email address",
    "string.empty": "Email is required",
  }),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/) // Indian mobile number pattern
    .required()
    .messages({
      "string.pattern.base": "Enter a valid 10-digit Indian mobile number",
    }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
  }),

  // role = "customer" or "owner" — only these two allowed
  role: Joi.string().valid("customer", "owner").required().messages({
    "any.only": "Role must be either 'customer' or 'owner'",
  }),
});

// ---- Login validation ----
export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required(),
});
