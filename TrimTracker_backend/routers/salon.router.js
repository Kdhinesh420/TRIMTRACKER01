//====
// routers/salon.router.js
// Salon CRUD (Find & Manage) routes
//====

import { Router } from "express";
import salonController from "../controllers/salon.controller.js";
import { authenticate, authorizeOwner } from "../middleware/authenticate.js";
import { validateSchema } from "../middleware/validate.schema.js";
import { createSalonSchema, updateSalonSchema } from "../schemas/salon.schema.js";

const salonRouter = Router();

// ---- /api/salons (Get all open salons) ----
// Protected as standard for customers, no special role check needed
salonRouter.get("/", authenticate, salonController.getAllSalons);

// ---- /api/salons/my-salon (Owner's own salon — MUST be before /:id) ----
// This returns the salon that belongs to the logged-in owner
salonRouter.get("/my-salon", authenticate, authorizeOwner, salonController.getOwnerSalon);

// ---- /api/salons/:id (Detailed salon) ----
salonRouter.get("/:id", authenticate, salonController.getSalonById);

// ---- /api/salons (Create a salon) ----
// Must be logged in AND an 'owner'
salonRouter.post(
  "/",
  authenticate,
  authorizeOwner, // Only role === 'owner' allowed
  validateSchema(createSalonSchema),
  salonController.createSalon
);

// ---- /api/salons/:id (Update salon details) ----
salonRouter.put(
  "/:id",
  authenticate,
  authorizeOwner,
  validateSchema(updateSalonSchema),
  salonController.updateSalon
);

export default salonRouter;
