// ============================================================
// pages/OwnerDashboard.jsx — Salon Owner Dashboard
//
// Simple, clean layout — NO sidebar.
// All data backend-la irundu varum.
//
// Flow:
//   1. getOwnerSalon() → owner's salon info
//   2. getOwnerDashboard(salonId) → stats + waitingList
//   3. Start/Complete → API calls
//   4. Auto-refresh every 20 seconds
// ============================================================

import React, { useState, useEffect } from "react";
import {
  getOwnerSalon,
  getOwnerDashboard,
  startService,
  completeService,
} from "../api/apiService";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OwnerDashboard = () => {
  // State — all data from backend
  const [salon, setSalon] = useState(null);
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  // Fetch salon + dashboard data from backend
  const fetchData = async () => {
    try {
      const salonData = await getOwnerSalon();
      setSalon(salonData);

      const stats = await getOwnerDashboard(salonData._id);
      setDashData(stats);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 20 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 20000);
    return () => clearInterval(interval);
  }, []);

  // Start Service
  const handleStart = async (queueId) => {
    setActionLoading(queueId + "_start");
    try {
      await startService(queueId);
      fetchData();
    } catch {
      alert("Failed to start service.");
    } finally {
      setActionLoading("");
    }
  };

  // Complete Service
  const handleComplete = async (queueId) => {
    setActionLoading(queueId + "_complete");
    try {
      await completeService(queueId);
      fetchData();
    } catch {
      alert("Failed to complete service.");
    } finally {
      setActionLoading("");
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">

      {/* Navbar */}
      <Navbar />

      {/* ============================================================
          MAIN CONTENT — Full width, no sidebar
          ============================================================ */}
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-[1100px] mx-auto">

          {/* ---- PAGE HEADER ---- */}
          <div className="mb-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-black text-text">
                  Owner Dashboard
                </h1>
                <p className="text-text-muted text-sm mt-1">
                  {salon ? `${salon.salonName} — Today's overview` : "Loading..."}
                </p>
              </div>

              {/* Queue status badge */}
              {salon && (
                <div className="flex items-center gap-3">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                    salon.isQueueOpen
                      ? "bg-success/10 text-success border border-success/20"
                      : "bg-danger/10 text-danger border border-danger/20"
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      salon.isQueueOpen ? "bg-success" : "bg-danger"
                    }`} />
                    {salon.isQueueOpen ? "Queue Open" : "Queue Closed"}
                  </div>
                  <span className="text-text-muted text-xs">
                    📍 {salon.district}, {salon.address}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ---- LOADING STATE ---- */}
          {loading && (
            <div className="text-center py-20">
              <p className="text-text-muted text-lg">⏳ Loading dashboard...</p>
            </div>
          )}

          {/* ---- ERROR STATE ---- */}
          {error && (
            <div className="card text-center py-10">
              <p className="text-danger text-lg font-bold mb-2">❌ {error}</p>
              <p className="text-text-muted text-sm mb-4">
                Make sure you have created a salon first.
              </p>
              <button onClick={fetchData} className="btn-primary text-sm">
                🔄 Try Again
              </button>
            </div>
          )}

          {/* ---- DASHBOARD DATA ---- */}
          {dashData && !error && (
            <>
              {/* ---- STATS CARDS ---- */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                  { icon: "👥", label: "Today's Customers", val: dashData.todayCustomers },
                  { icon: "⏳", label: "Current Queue", val: dashData.currentQueueSize },
                  { icon: "✅", label: "Completed", val: dashData.completedToday },
                  { icon: "⏱️", label: "Avg Wait", val: `${dashData.avgWaitTime}m` },
                ].map(({ icon, label, val }) => (
                  <div key={label} className="card text-center">
                    <span className="text-2xl block mb-2">{icon}</span>
                    <p className="text-3xl font-black text-text leading-none">{val}</p>
                    <p className="text-text-muted text-[0.7rem] mt-1.5 font-semibold uppercase tracking-wide">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              {/* ---- SERVICES ---- */}
              {salon && salon.services && salon.services.length > 0 && (
                <div className="card mb-6">
                  <h2 className="font-extrabold text-base text-text mb-4">
                    ✂️ Your Services
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {salon.services.map((svc, i) => (
                      <div key={i} className="bg-bg rounded-xl border border-border p-3.5">
                        <p className="text-sm font-bold text-text">{svc.serviceName}</p>
                        <div className="flex justify-between mt-2 text-xs text-text-muted">
                          <span>₹{svc.price}</span>
                          <span>⏱ {svc.estimatedDurationMins}m</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ---- QUEUE TABLE ---- */}
              <div className="card overflow-x-auto">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-extrabold text-base text-text">
                    👥 Waiting Queue
                    <span className="text-text-muted text-xs font-normal ml-2">
                      ({dashData.waitingList.length} people)
                    </span>
                  </h2>
                  <button
                    onClick={fetchData}
                    className="text-xs text-text-muted hover:text-primary transition-colors cursor-pointer font-semibold"
                  >
                    🔄 Refresh
                  </button>
                </div>

                {dashData.waitingList.length === 0 ? (
                  <p className="text-text-muted text-center py-10 text-sm">
                    No one in queue right now! 🎉
                  </p>
                ) : (
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b-2 border-border">
                        {["#", "Customer", "Service", "Wait", "Status", "Action"].map((h) => (
                          <th key={h} className="text-left px-3 py-2.5 text-text-muted font-bold text-[0.7rem] uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dashData.waitingList.map((c, i) => (
                        <tr key={c._id} className={`border-b border-border ${i % 2 !== 0 ? "bg-white/[0.02]" : ""}`}>

                          {/* # */}
                          <td className="px-3 py-3.5">
                            <span className="font-extrabold text-primary">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                          </td>

                          {/* Customer Name */}
                          <td className="px-3 py-3.5 text-text font-semibold">
                            {c.name}
                          </td>

                          {/* Service */}
                          <td className="px-3 py-3.5 text-text-muted text-xs">
                            {c.service}
                          </td>

                          {/* Wait Time */}
                          <td className="px-3 py-3.5">
                            <span className="bg-warning/10 text-warning px-2 py-0.5 rounded-full text-xs font-semibold">
                              {c.waitTime}m
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-3 py-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              c.status === "In-Progress"
                                ? "bg-success/10 text-success"
                                : "bg-secondary/10 text-secondary"
                            }`}>
                              {c.status === "In-Progress" ? "🟢 In Service" : "⏳ Waiting"}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="px-3 py-3.5">
                            {c.status === "Waiting" && (
                              <button
                                className="bg-bg border border-border text-text px-3 py-1.5 text-xs rounded-lg font-semibold cursor-pointer hover:border-primary transition-colors"
                                style={{ opacity: actionLoading === c._id + "_start" ? 0.5 : 1 }}
                                onClick={() => handleStart(c._id)}
                                disabled={!!actionLoading}
                              >
                                ▶ Start
                              </button>
                            )}
                            {c.status === "In-Progress" && (
                              <button
                                className="btn-primary px-3 py-1.5 text-xs rounded-lg"
                                style={{ opacity: actionLoading === c._id + "_complete" ? 0.5 : 1 }}
                                onClick={() => handleComplete(c._id)}
                                disabled={!!actionLoading}
                              >
                                ✅ Done
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default OwnerDashboard;
