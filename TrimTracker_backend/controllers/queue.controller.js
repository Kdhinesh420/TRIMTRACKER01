//====
// controllers/queue.controller.js
// Customer Join, Leave and Owner Status Update handlers
// Includes Socket.io integration for real-time updates!
//====

import queueServices from "../services/queue.services.js";
import { StatusCodes } from "http-status-codes";

// ---- POST /api/queue/join — Customer joins a salon ----
const joinQueue = async (req, res) => {
  try {
    const { userId } = req.user; // From authenticate middleware
    const { salonId, requestedServices } = req.body;

    const result = await queueServices.joinQueue(userId, salonId, requestedServices);

    // Join aana udane salon room-ku update anupuvom
    const io = req.app.get("socketio");
    io.to(salonId).emit("queueUpdated", { message: "New customer joined" });

    return res.status(StatusCodes.CREATED).json({
      message: "Successfully joined the queue!",
      queueId: result.insertedId,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

// ---- GET /api/queue/salon/:salonId — Fetch active queue for salon ----
const getSalonQueue = async (req, res) => {
  try {
    const { salonId } = req.params;
    const queue = await queueServices.getQueueBySalonId(salonId);
    return res.status(StatusCodes.OK).json(queue);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch queue.",
    });
  }
};

// ---- GET /api/queue/user — Customer checks their own status ----
const getMyStatus = async (req, res) => {
  try {
    const { userId } = req.user;
    const status = await queueServices.getQueueByUserId(userId);

    if (!status) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "You are not in any active queue.",
      });
    }

    return res.status(StatusCodes.OK).json(status);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch status.",
    });
  }
};

// ---- PUT /api/queue/:queueId/status — Owner updates status (Real-time!) ----
const updateStatus = async (req, res) => {
  try {
    const { queueId } = req.params;
    const { status } = req.body; // 'In-Progress', 'Completed', etc.

    const updatedQueue = await queueServices.updateQueueStatus(queueId, status);

    if (!updatedQueue) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Queue entry not found.",
      });
    }

    // 🚀 Socket.io Magic!
    // Owner update panna udane, antha salon room-la irukura ellarukum event anupuvom
    const io = req.app.get("socketio");
    const salonId = updatedQueue.salonId.toString();

    io.to(salonId).emit("queueUpdated", {
      message: `Queue status changed to ${status}`,
      salonId,
      status
    });

    return res.status(StatusCodes.OK).json({
      message: `Status updated to ${status}`,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

// ---- DELETE /api/queue — Customer cancels their position ----
const cancelQueue = async (req, res) => {
  try {
    const { userId } = req.user;
    const { queueId } = req.body;

    const cancelled = await queueServices.cancelQueue(queueId, userId);

    if (!cancelled) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Could not cancel. Either invalid request or already in-progress.",
      });
    }

    // Inform the salon owner/others that someone left
    const io = req.app.get("socketio");
    io.to(cancelled.salonId.toString()).emit("queueUpdated", { message: "Customer cancelled" });

    return res.status(StatusCodes.OK).json({
      message: "Queue position cancelled.",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

// ---- GET /api/queue/salon/:salonId/dashboard — Owner Dashboard Stats ----
// Returns processed data: todayCustomers, currentQueueSize, completedToday, avgWaitTime, waitingList
const getDashboardStats = async (req, res) => {
  try {
    const { salonId } = req.params;
    const stats = await queueServices.getDashboardStats(salonId);
    return res.status(StatusCodes.OK).json(stats);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch dashboard stats.",
    });
  }
};

const queueController = {
  joinQueue,
  getSalonQueue,
  getMyStatus,
  updateStatus,
  cancelQueue,
  getDashboardStats,
};

export default queueController;
