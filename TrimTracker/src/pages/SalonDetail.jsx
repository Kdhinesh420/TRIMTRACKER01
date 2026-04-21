import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getSalonById, joinQueue } from "../api/apiService";

const SalonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // IMPORTANT: Since Native Mongo doesn't add _id to object arrays automatically, we'll store the object or serviceName
  const [selectedService, setSelectedService] = useState(null);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  // Fetch salon details from backend
  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const data = await getSalonById(id);
        setSalon(data);
      } catch (err) {
        setError("Could not load salon details.");
      } finally {
        setLoading(false);
      }
    };
    fetchSalon();
  }, [id]);

  // Join queue handler
  const handleJoinQueue = async () => {
    if (user && user.role === "owner") {
      setJoinError("Owners cannot join the queue. Please login as a customer.");
      return;
    }

    if (!selectedService) {
      setJoinError("Please select a service.");
      return;
    }
    setJoinError("");
    setJoining(true);
    try {
      // Backend schema expects `requestedServices` as an array of strings
      await joinQueue({ salonId: id, requestedServices: [selectedService] });
      navigate("/queue"); // Go to live tracker
    } catch (err) {
      setJoinError(err.message);
    } finally {
      setJoining(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#111317] flex items-center justify-center font-sans">
      <div className="text-center">
        <span className="inline-block animate-spin text-4xl mb-4">🌀</span>
        <p className="text-slate-400 font-semibold text-lg">Loading salon...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#111317] flex items-center justify-center font-sans">
      <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl text-center shadow-lg">
        <span className="text-4xl block mb-3">⚠️</span>
        <p className="text-red-400 font-bold text-lg">{error}</p>
        <button onClick={() => navigate('/salons')} className="mt-4 text-emerald-400 hover:text-emerald-300 font-semibold underline text-sm">
          Go back to discovery
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#111317] font-sans pb-24">

      {/* ---- COVER PHOTO HEADER ---- */}
      <div className="relative h-72 md:h-96 w-full flex items-end">
        {/* Background Image/Gradient */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: salon?.coverPhoto
              ? `url(${salon.coverPhoto})`
              : "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')",
          }}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111317] via-[#111317]/80 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full px-6 relative z-10 pb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl shadow-xl shadow-black/50 border border-slate-700">💈</div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-md">
                {salon?.salonName || "Salon Name"}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm md:text-base text-slate-300 font-semibold drop-shadow-md">
                <span className="text-amber-500 flex items-center gap-1">★ {salon?.rating || "4.8"}</span>
                <span className="flex items-center gap-1">📍 {salon?.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- MAIN CONTENT ---- */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ---- LEFT: Services ---- */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-black text-2xl text-white flex items-center gap-3">
              Available Services <span className="text-sm bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">{(salon?.services || []).length}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(salon?.services || []).map((svc, idx) => {
                const isSelected = selectedService === svc.serviceName;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedService(svc.serviceName);
                      setJoinError(""); // clear error on select
                    }}
                    className={`flex justify-between items-center cursor-pointer p-5 rounded-2xl transition-all duration-300 border-2 ${isSelected
                      ? "border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/20 scale-[1.02]"
                      : "border-slate-800 bg-[#161920] hover:bg-slate-800/80 hover:border-slate-600"
                      }`}
                  >
                    <div>
                      <p className={`font-bold text-lg transition-colors ${isSelected ? 'text-amber-500' : 'text-white'}`}>
                        {svc.serviceName}
                      </p>
                      <p className="text-slate-400 text-sm font-semibold flex items-center gap-1.5 mt-1">
                        ⏱️ ~{svc.estimatedDurationMins} mins
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-black text-2xl ${isSelected ? 'text-amber-500' : 'text-emerald-400'}`}>
                        ₹{svc.price}
                      </p>
                      <div className={`mt-1 font-bold text-xs uppercase tracking-wider transition-opacity ${isSelected ? 'opacity-100 text-amber-500' : 'opacity-0'}`}>
                        Selected ✓
                      </div>
                    </div>
                  </div>
                );
              })}

              {(!salon?.services || salon?.services.length === 0) && (
                <div className="col-span-1 md:col-span-2 p-8 text-center bg-[#161920] rounded-2xl border border-slate-800">
                  <span className="text-4xl block mb-2 opacity-50">✂️</span>
                  <p className="text-slate-400 font-semibold">No services found for this salon.</p>
                </div>
              )}
            </div>
          </div>

          {/* ---- RIGHT: Queue Status + CTA ---- */}
          <div className="bg-[#161920] border border-slate-800 p-8 rounded-3xl shadow-xl sticky top-24">

            {/* Live Queue Status card */}
            <div className="text-center rounded-2xl p-6 bg-emerald-500/5 border-2 border-emerald-500/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6 shadow-inner shadow-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Live Queue
              </div>
              <p className="text-7xl font-black text-white leading-none tracking-tighter drop-shadow-md">
                {salon?.queueCount ?? "0"}
              </p>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-4">
                People Currently Waiting
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 font-bold text-amber-500 bg-amber-500/10 py-2.5 rounded-xl text-sm border border-amber-500/20">
                <span>⏱️</span> ~{salon?.waitTime ?? "N/A"} min estimated wait
              </div>
            </div>

            <div className="mt-8">
              {/* Owner restriction message */}
              {user && user.role === "owner" && (
                <div className="mb-4 bg-amber-500/10 border border-amber-500/30 text-amber-500 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
                  <span>ℹ️</span> Owners cannot join the queue.
                </div>
              )}

              {/* Join Queue CTA */}
              {joinError && (
                <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                  <span>⚠️</span> {joinError}
                </div>
              )}

              <button
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 px-6 rounded-2xl transition-all disabled:opacity-50 text-lg flex justify-center items-center gap-3 shadow-lg shadow-blue-600/20 active:scale-95 group"
                onClick={handleJoinQueue}
                disabled={joining || (salon?.services && salon.services.length === 0) || (user && user.role === "owner")}
              >
                {joining ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Joining...
                  </span>
                ) : (
                  <>
                    <span>👋</span>
                    <span className="group-hover:tracking-wide transition-all">Join Queue Now</span>
                  </>
                )}
              </button>
              <p className="text-slate-500 font-semibold text-xs text-center mt-5 flex items-center justify-center gap-1">
                <span>🔔</span> You'll be notified when it's your turn.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SalonDetail;
