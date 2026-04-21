//
// api/apiService.js
// Final Update to match our new Backend Routers!
//

import config from "../config";

const getToken = () => localStorage.getItem("trimtracker_token");

const buildHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

//
// AUTH APIs (Fixed endpoints)
//

export const registerUser = async (userData) => {
  const response = await fetch(`${config.API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Registration failed");
  }
  return response.json();
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${config.API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Login failed");
  }
  return response.json();
};

//
// SALON APIs (Fixed endpoints)
//

export const getAllSalons = async () => {
  const response = await fetch(`${config.API_BASE_URL}/salons`, {
    headers: buildHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch salons");
  return response.json();
};

export const getSalonById = async (salonId) => {
  const response = await fetch(`${config.API_BASE_URL}/salons/${salonId}`, {
    headers: buildHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch salon details");
  return response.json();
};

export const createSalon = async (salonData) => {
  const response = await fetch(`${config.API_BASE_URL}/salons`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(salonData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to create salon");
  }
  return response.json();
};

//
// QUEUE APIs (Fixed to match backend routers)
//

export const joinQueue = async (data) => {
  const response = await fetch(`${config.API_BASE_URL}/queue/join`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Could not join queue");
  }
  return response.json();
};

// Backend route: GET /api/queue/user
export const getMyQueueStatus = async () => {
  const response = await fetch(`${config.API_BASE_URL}/queue/user`, {
    headers: buildHeaders(),
  });
  if (response.status === 404) return null; // No active queue
  if (!response.ok) throw new Error("Failed to get queue status");
  return response.json();
};

// Backend route: DELETE /api/queue
export const cancelMyQueue = async (queueId) => {
  const response = await fetch(`${config.API_BASE_URL}/queue`, {
    method: "DELETE",
    headers: buildHeaders(),
    body: JSON.stringify({ queueId }),
  });
  if (!response.ok) throw new Error("Failed to cancel queue");
  return response.json();
};

//
// OWNER DASHBOARD APIs
//

// GET /api/salons/my-salon — Owner's own salon fetch pannuvom
// Token use panni, owner-oda salon-a backend find pannum
export const getOwnerSalon = async () => {
  const response = await fetch(`${config.API_BASE_URL}/salons/my-salon`, {
    headers: buildHeaders(),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to fetch your salon");
  }
  return response.json();
};

// GET /api/queue/salon/:salonId/dashboard — Processed dashboard stats
// Returns: { todayCustomers, currentQueueSize, completedToday, avgWaitTime, waitingList }
export const getOwnerDashboard = async (salonId) => {
  const response = await fetch(`${config.API_BASE_URL}/queue/salon/${salonId}/dashboard`, {
    headers: buildHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch dashboard data");
  return response.json();
};

// Backend route: PUT /api/queue/:queueId/status
export const startService = async (queueId) => {
  const response = await fetch(`${config.API_BASE_URL}/queue/${queueId}/status`, {
    method: "PUT",
    headers: buildHeaders(),
    body: JSON.stringify({ status: "In-Progress" }),
  });
  if (!response.ok) throw new Error("Failed to update status");
  return response.json();
};

export const completeService = async (queueId) => {
  const response = await fetch(`${config.API_BASE_URL}/queue/${queueId}/status`, {
    method: "PUT",
    headers: buildHeaders(),
    body: JSON.stringify({ status: "Completed" }),
  });
  if (!response.ok) throw new Error("Failed to update status");
  return response.json();
};
