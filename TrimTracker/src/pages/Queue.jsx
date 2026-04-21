// ============================================================
// pages/Queue.jsx — Customer Live Tracker Dashboard
//
// OLD: Local state mattum use panninom
// NEW: Redux queue slice-la queue status save pannrom!
//
// Redux functions used:
//   useDispatch() → queue actions dispatch
//   useSelector() → read queue state if needed
//   dispatch(setQueueStatus(data)) → queue data save
//   dispatch(clearQueueStatus()) → queue cancel aana clear
// ============================================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyQueueStatus, cancelMyQueue } from "../api/apiService";

// Redux
import { useDispatch } from "react-redux";
import { setQueueStatus, clearQueueStatus } from "../store/reducers/queueSlice";

const Queue = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [status, setStatus]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [cancelling, setCancelling] = useState(false);

  // Fetch live queue status
  const fetchStatus = async () => {
    try {
      const data = await getMyQueueStatus(); // ← API call
      setStatus(data);

      // ✅ Redux store-layum queue data save pannrom!
      if (data) {
        dispatch(setQueueStatus(data));
      }
    } catch (err) {
      setError("Could not fetch queue status. Are you logged in?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Cancel queue
  const handleCancel = async () => {
    if (!window.confirm("Cancel your queue position?")) return;
    setCancelling(true);
    try {
      await cancelMyQueue();

      // ✅ Redux store-la queue clear pannrom!
      dispatch(clearQueueStatus());

      navigate("/salons");
    } catch (err) {
      setError("Failed to cancel. Try again.");
    } finally {
      setCancelling(false);
    }
  };

  // Progress %
  const totalSlots = (status?.position || 1) + 2;
  const progressPercent = Math.max(10, Math.round(((totalSlots - (status?.position || 1)) / totalSlots) * 100));

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--color-text-muted)", fontSize: "1.1rem" }}>Checking your queue...</p>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
      <p style={{ color: "var(--color-danger)" }}>{error}</p>
      <button className="btn-primary" onClick={() => navigate("/login")}>Login First</button>
    </div>
  );

  if (!status) return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
      <p style={{ color: "var(--color-text-muted)", fontSize: "1.1rem" }}>You haven't joined any queue yet.</p>
      <button className="btn-primary" onClick={() => navigate("/salons")}>Find a Salon to Join Queue</button>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--color-bg)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "5rem 1.5rem 3rem",
    }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>

        {/* ---- Header ---- */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {status?.salonName}
          </p>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--color-text)", marginTop: "0.3rem" }}>
            My Live Queue
          </h1>
        </div>

        {/* ---- Main Glowing Status Card ---- */}
        <div
          className="card animate-glow"
          style={{
            textAlign: "center", marginBottom: "1.5rem",
            border: "2px solid rgba(245,158,11,0.35)",
          }}
        >
          <div style={{ marginBottom: "1.5rem" }}>
            <span className="badge-live">● Live Tracking</span>
          </div>

          <div style={{ marginBottom: "0.5rem" }}>
            <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Your Queue Position
            </p>
            <p style={{
              fontSize: "5rem", fontWeight: 900, lineHeight: 1.1,
              color: "var(--color-primary)",
            }}>
              {status?.position}
            </p>
          </div>

          <div style={{
            background: "var(--color-bg)",
            borderRadius: "0.85rem",
            padding: "1rem",
            marginBottom: "1.5rem",
          }}>
            <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Estimated Wait Time
            </p>
            <p style={{ fontSize: "2.25rem", fontWeight: 900, color: "var(--color-text)", marginTop: "0.25rem" }}>
              ~{status?.estimatedWait} Minutes
            </p>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
              <span>Queue Progress</span>
              <span>{progressPercent}% Complete</span>
            </div>
            <div style={{ background: "var(--color-bg)", borderRadius: "9999px", height: "10px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${progressPercent}%`,
                  background: "linear-gradient(90deg, var(--color-primary), #f97316)",
                  borderRadius: "9999px",
                  transition: "width 1s ease-out",
                }}
              />
            </div>
          </div>
        </div>

        {/* ---- Service & Salon info ---- */}
        <div className="card" style={{ marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {[
            { label: "Service", val: status?.service },
            { label: "Salon",   val: status?.salonName },
          ].map(({ label, val }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
              <span style={{ color: "var(--color-text-muted)" }}>{label}</span>
              <span style={{ color: "var(--color-text)", fontWeight: 600 }}>{val}</span>
            </div>
          ))}
        </div>

        {/* ---- CTAs ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", textAlign: "center" }}>
          <button
            className="btn-primary"
            style={{ width: "100%" }}
            onClick={() => window.open(`https://maps.google.com/?q=${status?.salonName}`, "_blank")}
          >
            🗺️ Navigate to Salon
          </button>
          <button
            className="btn-danger"
            onClick={handleCancel}
            disabled={cancelling}
          >
            {cancelling ? "Cancelling..." : "Cancel My Position"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Queue;
