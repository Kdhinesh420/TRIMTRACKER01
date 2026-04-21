//====
// services/queue.services.js
// All DB operations for Queue collection
//
// Queue = Core engine of TrimTracker!
// Every customer who joins a salon creates one Queue document.
//====

import { ObjectId } from "mongodb";
import { client } from "../index.js";
import config from "../config/index.js";

const MONGO_DATABASE = config.database;
const COLLECTION = "queues";

// ---- Customer joins a salon queue ----
const joinQueue = async (userId, salonId, requestedServices) => {
  // Check: Is this customer already in an active queue?
  const existingQueue = await client
    .db(MONGO_DATABASE)
    .collection(COLLECTION)
    .findOne({
      userId: new ObjectId(userId),
      status: { $in: ["Waiting", "In-Progress"] }, // Active statuses
    });

  if (existingQueue) {
    // Already in queue — cannot join another
    throw new Error("You are already in a queue. Cancel it first.");
  }

  const newQueueEntry = {
    userId: new ObjectId(userId),
    salonId: new ObjectId(salonId),
    requestedServices: requestedServices, // e.g., ["Haircut", "Beard Trim"]
    status: "Waiting",
    joinedAt: new Date(),
  };

  const result = await client
    .db(MONGO_DATABASE)
    .collection(COLLECTION)
    .insertOne(newQueueEntry);

  return result;
};

// ---- Get all active queue entries for a salon ----
// Used by: Owner dashboard + calculating wait time
const getQueueBySalonId = async (salonId) => {
  return await client
    .db(MONGO_DATABASE)
    .collection(COLLECTION)
    .find({
      salonId: new ObjectId(salonId),
      status: { $in: ["Waiting", "In-Progress"] }, // Only active queue entries
    })
    .sort({ joinedAt: 1 }) // Earliest first (Queue order!)
    .toArray();
};

// ---- Get single customer's current queue status ----
const getQueueByUserId = async (userId) => {
  // Find their most recent active queue entry
  const queueEntry = await client
    .db(MONGO_DATABASE)
    .collection(COLLECTION)
    .findOne(
      {
        userId: new ObjectId(userId),
        status: { $in: ["Waiting", "In-Progress"] },
      },
      { sort: { joinedAt: -1 } } // Most recent
    );

  if (!queueEntry) return null;

  // Also fetch salon name for display
  const salon = await client
    .db(MONGO_DATABASE)
    .collection("salons")
    .findOne({ _id: queueEntry.salonId });

  // Calculate position in queue (how many people joined before them)
  const position = await client
    .db(MONGO_DATABASE)
    .collection(COLLECTION)
    .countDocuments({
      salonId: queueEntry.salonId,
      status: "Waiting",
      joinedAt: { $lte: queueEntry.joinedAt }, // Joined before or same time
    });

  // Estimated wait = position × 20 minutes (average per person)
  const estimatedWait = position * 20;

  return {
    ...queueEntry,
    position,
    estimatedWait,
    salonName: salon?.salonName || "Unknown Salon",
  };
};

// ---- Owner updates queue status ----
// Returns: { updatedEntry, salonId } — salonId for Socket.io room emit
const updateQueueStatus = async (queueId, newStatus) => {
  try {
    const result = await client
      .db(MONGO_DATABASE)
      .collection(COLLECTION)
      .findOneAndUpdate(
        { _id: new ObjectId(queueId) },
        {
          $set: {
            status: newStatus,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" } // Returns the updated document
      );

    return result; // Contains salonId for Socket.io
  } catch (err) {
    throw new Error("Invalid queue ID");
  }
};

// ---- Customer cancels their queue ----
const cancelQueue = async (queueId, userId) => {
  try {
    const result = await client
      .db(MONGO_DATABASE)
      .collection(COLLECTION)
      .findOneAndUpdate(
        {
          _id: new ObjectId(queueId),
          userId: new ObjectId(userId),    // Only cancel THEIR OWN entry
          status: { $in: ["Waiting"] },    // Can only cancel if Waiting
        },
        {
          $set: { status: "Cancelled", updatedAt: new Date() },
        },
        { returnDocument: "after" }
      );

    return result; // null if not found or already In-Progress
  } catch (err) {
    throw new Error("Invalid queue ID");
  }
};

// ---- Get processed dashboard stats for a salon ----
// Returns: todayCustomers, currentQueueSize, completedToday, avgWaitTime, waitingList
const getDashboardStats = async (salonId) => {
  const db = client.db(MONGO_DATABASE);

  // Today's start time (midnight)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // 1. Total customers today (all statuses — Waiting, In-Progress, Completed)
  const todayCustomers = await db.collection(COLLECTION).countDocuments({
    salonId: new ObjectId(salonId),
    joinedAt: { $gte: todayStart },
  });

  // 2. Current queue size (Waiting + In-Progress)
  const currentQueueSize = await db.collection(COLLECTION).countDocuments({
    salonId: new ObjectId(salonId),
    status: { $in: ["Waiting", "In-Progress"] },
  });

  // 3. Completed today
  const completedToday = await db.collection(COLLECTION).countDocuments({
    salonId: new ObjectId(salonId),
    status: "Completed",
    joinedAt: { $gte: todayStart },
  });

  // 4. Average wait time (for completed entries today)
  const completedEntries = await db.collection(COLLECTION).find({
    salonId: new ObjectId(salonId),
    status: "Completed",
    joinedAt: { $gte: todayStart },
    updatedAt: { $exists: true },
  }).toArray();

  let avgWaitTime = 0;
  if (completedEntries.length > 0) {
    const totalMinutes = completedEntries.reduce((sum, entry) => {
      const waitMs = new Date(entry.updatedAt) - new Date(entry.joinedAt);
      return sum + (waitMs / 60000); // Convert ms to minutes
    }, 0);
    avgWaitTime = Math.round(totalMinutes / completedEntries.length);
  }

  // 5. Waiting list — active queue entries with user names
  const activeQueue = await db.collection(COLLECTION).find({
    salonId: new ObjectId(salonId),
    status: { $in: ["Waiting", "In-Progress"] },
  }).sort({ joinedAt: 1 }).toArray();

  // Populate user names for each queue entry
  const waitingList = [];
  for (const entry of activeQueue) {
    const user = await db.collection("users").findOne({ _id: entry.userId });
    const waitMinutes = Math.round((Date.now() - new Date(entry.joinedAt)) / 60000);
    waitingList.push({
      _id: entry._id,
      userId: entry.userId,
      name: user?.name || "Unknown",
      service: (entry.requestedServices || []).join(", "),
      status: entry.status,
      waitTime: waitMinutes,
      joinedAt: entry.joinedAt,
    });
  }

  return {
    todayCustomers,
    currentQueueSize,
    completedToday,
    avgWaitTime,
    waitingList,
  };
};

const queueServices = {
  joinQueue,
  getQueueBySalonId,
  getQueueByUserId,
  updateQueueStatus,
  cancelQueue,
  getDashboardStats,
};

export default queueServices;
