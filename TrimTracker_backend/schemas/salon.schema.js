//====
// schemas/salon.schema.js
// Salon create & update validation
//====

import Joi from "joi";

// ---- Create Salon ----
export const createSalonSchema = Joi.object({
  salonName: Joi.string().min(2).required().messages({
    "string.empty": "Salon name is required",
  }),

  address: Joi.string().min(5).required().messages({
    "string.empty": "Address is required",
  }),

  // Add license field (optional but expected)
  license: Joi.string().allow("").optional(),

  // services = array of objects, minimum 1 service required
  services: Joi.array()
    .items(
      Joi.object({
        serviceName: Joi.string().required(),
        price: Joi.number().min(0).required(),
        estimatedDurationMins: Joi.number().min(1).required(),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one service is required",
    }),
});

// ---- Update Salon (all fields optional) ----
export const updateSalonSchema = Joi.object({
  salonName: Joi.string().min(2),
  address: Joi.string().min(5),
  license: Joi.string().allow("").optional(),
  isQueueOpen: Joi.boolean(), // Toggle queue open/close
  services: Joi.array().items(
    Joi.object({
      serviceName: Joi.string().required(),
      price: Joi.number().min(0).required(),
      estimatedDurationMins: Joi.number().min(1).required(),
    })
  ),
});
