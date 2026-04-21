//====
// schemas/queue.schema.js
// Customer queue join validation
//====

import Joi from "joi";

// ---- Join Queue ----
export const joinQueueSchema = Joi.object({
  salonId: Joi.string().length(24).required().messages({
    "string.length": "Invalid salon ID",
    "string.empty": "Salon ID is required",
  }),

  // requestedServices = array of service names like ["Haircut", "Beard Trim"]
  requestedServices: Joi.array()
    .items(Joi.string())
    .min(1)
    .required()
    .messages({
      "array.min": "Select at least one service",
    }),
});

// ---- Update Queue Status (Owner uses this) ----
export const updateQueueStatusSchema = Joi.object({
  // Only these 4 values allowed
  status: Joi.string()
    .valid("Waiting", "In-Progress", "Completed", "Cancelled")
    .required()
    .messages({
      "any.only": "Status must be: Waiting, In-Progress, Completed, or Cancelled",
    }),
});
