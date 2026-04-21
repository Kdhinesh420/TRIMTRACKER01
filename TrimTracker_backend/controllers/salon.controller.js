//====
// controllers/salon.controller.js
// Salon CRUD handlers
//====

import salonServices from "../services/salon.services.js";
import { StatusCodes } from "http-status-codes";

// ---- GET /api/salons — All open salons ----
const getAllSalons = async (req, res) => {
  try {
    const salons = await salonServices.getAllOpenSalons();

    if (salons.length === 0) {
      return res.status(StatusCodes.OK).json({
        message: "No salons found.",
        data: [],
      });
    }

    return res.status(StatusCodes.OK).json(salons);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch salons.",
      error: error.message,
    });
  }
};

// ---- GET /api/salons/:id — Single salon ----
const getSalonById = async (req, res) => {
  try {
    const { id } = req.params;
    const salon = await salonServices.getSalonById(id);

    if (!salon) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Salon not found.",
      });
    }

    return res.status(StatusCodes.OK).json(salon);
  } catch (error) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: error.message,
    });
  }
};

// ---- POST /api/salons — Owner creates a salon ----
const createSalon = async (req, res) => {
  try {
    // req.user = { userId, role } — set by authenticate middleware
    const ownerId = req.user.userId;

    const result = await salonServices.createSalon(req.body, ownerId);

    return res.status(StatusCodes.CREATED).json({
      message: "Salon created successfully!",
      salonId: result.insertedId,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to create salon.",
      error: error.message,
    });
  }
};

// ---- PUT /api/salons/:id — Owner updates salon ----
const updateSalon = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await salonServices.updateSalon(id, req.body);

    if (!updated) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Salon not found or nothing changed.",
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "Salon updated successfully!",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

// ---- GET /api/salons/my-salon — Owner's own salon ----
// Token-la irukura userId use panni, ownerId match aagura salon-a fetch pannuvom
const getOwnerSalon = async (req, res) => {
  try {
    const ownerId = req.user.userId; // JWT token-la irundu vanthathu
    const salon = await salonServices.getOwnerSalon(ownerId);

    if (!salon) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "You don't have a salon yet. Create one first!",
      });
    }

    return res.status(StatusCodes.OK).json(salon);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch your salon.",
      error: error.message,
    });
  }
};

const salonController = {
  getAllSalons,
  getSalonById,
  createSalon,
  updateSalon,
  getOwnerSalon,
};

export default salonController;
