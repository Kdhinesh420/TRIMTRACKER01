//====
// services/salon.services.js
// All DB operations for Salons collection
//
// Unga pattern: client.db().collection() — MongoDB Native
//====

import { ObjectId } from "mongodb";
import { client } from "../index.js";
import config from "../config/index.js";

const MONGO_DATABASE = config.database;
const COLLECTION = "salons"; // Collection name in MongoDB

// ---- Get all open salons ----
// isQueueOpen: true = salon currently accepting customers
const getAllOpenSalons = async () => {
  return await client
    .db(MONGO_DATABASE)
    .collection(COLLECTION)
    .find({ isQueueOpen: true }) // Only open salons
    .sort({ createdAt: -1 })     // Newest first
    .toArray();
};

// ---- Get single salon by ID ----
const getSalonById = async (id) => {
  try {
    const salon = await client
      .db(MONGO_DATABASE)
      .collection(COLLECTION)
      .findOne({ _id: new ObjectId(id) });

    return salon; // null if not found
  } catch (err) {
    throw new Error("Invalid salon ID format");
  }
};

// ---- Create a new salon (Owner only) ----
const createSalon = async (salonData, ownerId) => {
  const newSalon = {
    ownerId: new ObjectId(ownerId), // Link to owner's user ID
    salonName: salonData.salonName,
    district: salonData.district,  // Added district
    address: salonData.address,
    license: salonData.license || "", // New field
    services: salonData.services,   // Array of { serviceName, price, estimatedDurationMins }
    isQueueOpen: true,              // Open by default
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await client
    .db(MONGO_DATABASE)
    .collection(COLLECTION)
    .insertOne(newSalon);

  return result;
};

// ---- Update salon details (Owner only) ----
// Can update name, address, services, OR toggle isQueueOpen
const updateSalon = async (id, updatedData) => {
  try {
    const result = await client
      .db(MONGO_DATABASE)
      .collection(COLLECTION)
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            ...updatedData,       // Spread all fields from request body
            updatedAt: new Date(),
          },
        }
      );

    // modifiedCount = 0 means ID not found or data same
    return result.modifiedCount > 0;
  } catch (err) {
    throw new Error("Invalid salon ID format");
  }
};

// ---- Get salon by ownerId (Owner's own salon) ----
// Owner login aana udane, avar salon-a find pannuvom
const getOwnerSalon = async (ownerId) => {
  return await client
    .db(MONGO_DATABASE)
    .collection(COLLECTION)
    .findOne({ ownerId: new ObjectId(ownerId) });
};

const salonServices = {
  getAllOpenSalons,
  getSalonById,
  createSalon,
  updateSalon,
  getOwnerSalon,
};

export default salonServices;
