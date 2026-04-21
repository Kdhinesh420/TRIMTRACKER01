// ============================================================
// pages/Salons.jsx — Find Salons Page
//
// NEW: Map removed. Added District Filter.
// Role: Customers use this to find and join salon queues.
// ============================================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSalons } from "../api/apiService";

// ---------- Salon Card component ----------
const SalonCard = ({ salon, onClick }) => (
  <div
    onClick={onClick}
    className="group bg-[#161920] border border-slate-800 rounded-3xl p-6 cursor-pointer transition-all hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-500/10 active:scale-[0.98]"
  >
    <div className="flex justify-between items-start mb-6">
      <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
        💈
      </div>
      <span className={`text-[10px] font-black px-3 py-1.5 rounded-full border uppercase tracking-[0.15em] ${(salon.waitTime || 0) <= 20
        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        : "bg-red-500/10 text-red-400 border-red-500/20"
        }`}>
        {(salon.waitTime || 0) <= 20 ? "● Low Wait" : "● Busy"}
      </span>
    </div>

    <h3 className="text-xl font-black text-white mb-2 group-hover:text-amber-500 transition-colors">{salon.salonName}</h3>
    <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6 line-clamp-2">
      📍 {salon.address}
    </p>

    <div className="grid grid-cols-3 gap-2 pt-6 border-t border-slate-800/50">
      <div className="text-center">
        <p className="text-amber-500 font-black text-sm">★ {salon.rating || "4.8"}</p>
        <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mt-1">Rating</p>
      </div>
      <div className="text-center border-x border-slate-800/50">
        <p className="text-white font-black text-sm">~{salon.waitTime || 0}m</p>
        <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mt-1">Wait</p>
      </div>
      <div className="text-center">
        <p className="text-white font-black text-sm">{salon.queueCount || 0}</p>
        <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mt-1">Queue</p>
      </div>
    </div>
  </div>
);

const Salons = () => {
  const navigate = useNavigate();

  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const districts = [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Thanjavur", "Nagercoil", "Dindigul", "Hosur", "Kanchipuram", "Karaikudi", "Kumbakonam", "Namakkal", "Pudukkottai", "Sivakasi", "Tanjore", "Theni", "Tiruppur", "Vaniyambadi", "Virudhunagar"
  ];

  // Fetch salons
  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const data = await getAllSalons();
        setSalons(data);
      } catch (err) {
        setError("Could not load salons. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSalons();
  }, []);

  // Filter salons by District and Search
  const filtered = salons.filter((s) => {
    const matchesDistrict = selectedDistrict === "" || s.district === selectedDistrict;
    const matchesSearch = s.salonName?.toLowerCase().includes(search.toLowerCase()) || 
                          s.address?.toLowerCase().includes(search.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#111317] font-sans pb-24 pt-20">
      
      {/* ---- HERO / TOP SECTION ---- */}
      <div className="relative overflow-hidden py-16 px-6 sm:px-12 border-b border-slate-800 bg-[#161920]">
        {/* Subtle Background pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#f59e0b 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 tracking-tighter">
              Book Your Appointment <span className="text-amber-500 underline decoration-amber-500/30">Near You.</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium mb-10 max-w-lg">
              Select your district to find the best salons and check real-time wait times.
            </p>

            {/* FILTERS CONTAINER */}
            <div className="flex flex-col md:flex-row gap-4">
              
              {/* District Select */}
              <div className="relative group w-full md:w-64">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-amber-500 font-bold">📍</div>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-[#111317] border border-slate-700 rounded-2xl py-4 pl-12 pr-10 text-white font-bold text-sm focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Districts</option>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">▼</div>
              </div>

              {/* Search Input */}
              <div className="relative flex-1 group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">🔍</div>
                <input
                  type="text"
                  placeholder="Search salon name or area..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#111317] border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white font-bold text-sm focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- SALONS GRID SECTION ---- */}
      <div className="max-w-7xl mx-auto px-6 mt-16 flex-1">
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold mt-6 uppercase tracking-widest text-xs">Fetching Salons...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center">
            <span className="text-4xl mb-4 block">⚠️</span>
            <p className="text-red-400 font-black text-lg">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                {selectedDistrict ? `Salons in ${selectedDistrict}` : "All Available Salons"}
                <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-md border border-slate-700">{filtered.length}</span>
              </h2>
              {selectedDistrict && (
                <button 
                  onClick={() => setSelectedDistrict("")}
                  className="text-xs font-bold text-slate-500 hover:text-amber-500 transition-colors uppercase tracking-widest"
                >
                  Clear Filter ×
                </button>
              )}
            </div>

            {!selectedDistrict ? (
              <div className="flex flex-col items-center justify-center py-32 bg-slate-900/10 border border-slate-800 border-dashed rounded-[3rem]">
                <span className="text-6xl mb-6">📍</span>
                <p className="text-white font-black text-2xl mb-2">Select Your District</p>
                <p className="text-slate-500 text-sm font-medium">Please choose a district from the filter above to find salons near you.</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 bg-slate-900/10 border border-slate-800 border-dashed rounded-[3rem]">
                <span className="text-6xl mb-6 opacity-30 grayscale">💈</span>
                <p className="text-white font-black text-xl mb-2">No Salons Found in {selectedDistrict}</p>
                <p className="text-slate-500 text-sm font-medium">Try choosing a different district or search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((salon) => (
                  <SalonCard
                    key={salon._id}
                    salon={salon}
                    onClick={() => navigate(`/salons/${salon._id}`)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default Salons;
