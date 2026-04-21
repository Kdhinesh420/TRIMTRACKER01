//====
// routers/queue.router.js
// Live Queue operations — Join, Track, and Update Status
// Supports Socket.io via controllers
//====

import { Router } from "express";
import queueController from "../controllers/queue.controller.js";
import { authenticate, authorizeOwner, authorizeCustomer } from "../middleware/authenticate.js";
import { validateSchema } from "../middleware/validate.schema.js";
import { joinQueueSchema, updateQueueStatusSchema } from "../schemas/queue.schema.js";

const queueRouter = Router();

// ---- /api/queue/join (Customer joins a salon) ----
queueRouter.post(
  "/join",
  authenticate,      // User logged-in check
  authorizeCustomer, // Owner-ala join panna mudiyathu!
  validateSchema(joinQueueSchema),
  queueController.joinQueue
);

// ---- /api/queue/salon/:salonId/dashboard (Owner Dashboard — processed stats) ----
// Returns: todayCustomers, currentQueueSize, completedToday, avgWaitTime, waitingList
queueRouter.get("/salon/:salonId/dashboard", authenticate, queueController.getDashboardStats);

// ---- /api/queue/salon/:salonId (Fetch salon's current wait list) ----
// Used by owners for dashboard, and customers for overview
queueRouter.get("/salon/:salonId", authenticate, queueController.getSalonQueue);

// ---- /api/queue/user (Customer checks their own current wait status) ----
queueRouter.get("/user", authenticate, queueController.getMyStatus);

// ---- /api/queue/:queueId/status (Owner updates person from 'Waiting' to 'In-Progress') ----
// IMPORTANT: Role = owner required
queueRouter.put(
  "/:queueId/status",
  authenticate,
  authorizeOwner, // Check owner permission
  validateSchema(updateQueueStatusSchema),
  queueController.updateStatus
);

// ---- /api/queue (Customer cancels their position) ----
queueRouter.delete(
  "/",
  authenticate,
  queueController.cancelQueue
);

export default queueRouter;
