import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgPrimary from "../assets/Moody elegance in a hair salon.png";
import bgLight from "../assets/Futuristic salon with holographic queue display.png";

const StepCard = ({ number, icon, title, desc }) => (
  <div style={{
    background: "var(--color-bg-card)",
    border: "1px solid var(--color-border)",
  }} className="p-8 rounded-3xl text-center flex-1 min-w-[280px] shadow-xl hover:-translate-y-2 transition-transform duration-300">
    <div style={{ background: "var(--color-primary)", color: "#fff" }}
      className="w-14 h-14 rounded-full flex items-center justify-center font-black text-xl mx-auto mb-6 shadow-lg">
      {number}
    </div>
    <div className="text-5xl mb-4">{icon}</div>
    <h3 style={{ color: "var(--color-text)" }} className="font-bold text-xl mb-3">{title}</h3>
    <p style={{ color: "var(--color-text-muted)" }} className="text-sm leading-relaxed">{desc}</p>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [isLight, setIsLight] = useState(document.body.classList.contains("light"));

  useEffect(() => {
    // Observe changes to the body class to detect theme toggle
    const observer = new MutationObserver(() => {
      setIsLight(document.body.classList.contains("light"));
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: "var(--color-bg)", color: "var(--color-text)" }} className="min-h-screen font-sans">

      {/* ── 1. HERO ── */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${isLight ? bgLight : bgPrimary})` }} />
        <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(to right, var(--color-bg-card) 2%, transparent 10%)" }} />
        <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(to top, var(--color-bg-card) 2%, transparent 10%)" }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full py-12 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

            {/* LEFT: Text */}
            <div>
              <div style={{ background: "color-mix(in srgb, var(--color-primary) 15%, transparent)", border: "1px solid color-mix(in srgb, var(--color-primary) 35%, transparent)" }}
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8">
                <span style={{ background: "var(--color-success)" }} className="w-2 h-2 rounded-full animate-pulse" />
                <span style={{ color: "var(--color-primary)" }} className="text-xs font-black tracking-widest uppercase">Live Queues Active Now</span>
              </div>

              <h1 style={{ color: "var(--color-text)" }} className="text-5xl md:text-7xl font-black leading-[1.1] mb-6 tracking-tight drop-shadow-lg">
                Stop Waiting.<br />
                <span style={{ color: "var(--color-primary)" }}>Track Your</span><br />
                Live Queue.
              </h1>

              <p style={{ color: "var(--color-text)" }} className="text-lg md:text-xl leading-relaxed mb-10 max-w-lg font-medium">
                Join the virtual queue before you leave home. Arrive exactly when it's your turn — no more sitting and waiting at the salon.
              </p>

              <div className="flex flex-wrap gap-4">
                <button onClick={() => navigate("/salons")}
                  className="btn-primary py-4 px-8 rounded-2xl text-lg hover:-translate-y-1 active:scale-95">
                  🔍 Find Nearby Salons
                </button>
                <button onClick={() => navigate("/register?role=owner")}
                  style={{ background: "color-mix(in srgb, var(--color-bg-card) 85%, transparent)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
                  className="py-4 px-8 rounded-2xl font-bold text-lg transition-all backdrop-blur-md hover:-translate-y-1 active:scale-95">
                  Partner as Owner
                </button>
              </div>
            </div>

            {/* RIGHT: Live Queue Mockup Card */}
            <div className="hidden md:flex justify-center md:justify-end">
              <div style={{ background: "color-mix(in srgb, var(--color-bg-card) 75%, transparent)", border: "1px solid color-mix(in srgb, var(--color-border) 60%, transparent)" }}
                className="backdrop-blur-xl p-6 rounded-3xl w-full max-w-sm shadow-2xl hover:scale-[1.02] transition-transform duration-500">

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p style={{ color: "var(--color-text-muted)" }} className="text-[10px] uppercase tracking-widest font-black mb-1">Style Hub • T.Nagar</p>
                    <p style={{ color: "var(--color-text)" }} className="font-black text-lg">Your Queue Status</p>
                  </div>
                  <span style={{ background: "color-mix(in srgb, var(--color-success) 20%, transparent)", color: "var(--color-success)", border: "1px solid color-mix(in srgb, var(--color-success) 30%, transparent)" }}
                    className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                    <span style={{ background: "var(--color-success)" }} className="w-1.5 h-1.5 rounded-full animate-pulse" /> Live
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: "Position", val: "#3" },
                    { label: "Ahead",    val: "2"  },
                    { label: "Wait",     val: "15m", highlight: true },
                  ].map(({ label, val, highlight }, i) => (
                    <div key={i} style={{ background: "color-mix(in srgb, var(--color-bg) 80%, transparent)", border: "1px solid color-mix(in srgb, var(--color-border) 50%, transparent)" }}
                      className="rounded-2xl p-3 text-center">
                      <p style={{ color: highlight ? "var(--color-primary)" : "var(--color-text)" }} className="text-2xl font-black">{val}</p>
                      <p style={{ color: "var(--color-text-muted)" }} className="text-[9px] uppercase tracking-widest mt-1 font-bold">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <div style={{ color: "var(--color-text-muted)" }} className="flex justify-between text-[11px] font-bold mb-2 uppercase tracking-wide">
                    <span>Progress</span><span>~15 min left</span>
                  </div>
                  <div style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }} className="rounded-full h-2 overflow-hidden">
                    <div style={{ background: "var(--color-primary)" }} className="w-[60%] h-full rounded-full" />
                  </div>
                </div>

                <div style={{ background: "color-mix(in srgb, var(--color-secondary) 15%, transparent)", color: "var(--color-secondary)", border: "1px dashed color-mix(in srgb, var(--color-secondary) 35%, transparent)" }}
                  className="w-full font-bold py-4 rounded-xl text-center text-sm">
                  Simulated View
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. HOW IT WORKS ── */}
      <section style={{ background: "var(--color-bg)", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }} className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 style={{ color: "var(--color-text)" }} className="text-3xl md:text-5xl font-black mb-4">How TrimTracker Works</h2>
            <p style={{ color: "var(--color-text-muted)" }} className="text-lg">3 simple steps. Zero waiting at the salon.</p>
          </div>
          <div className="flex flex-wrap gap-8 justify-center">
            <StepCard number="01" icon="🔍" title="Find & Join Queue"    desc="Search nearby salons, see live queue status, and join instantly from your phone." />
            <StepCard number="02" icon="📊" title="Track Live Position"  desc="Watch your queue position update in real-time. Know exactly when to leave home." />
            <StepCard number="03" icon="🚶" title="Arrive Exactly on Time" desc="Walk in when it's your turn. No waiting. No wasted time. Just fresh hair." />
          </div>
        </div>
      </section>

      {/* ── 3. STATS BANNER ── */}
      <section style={{ background: "var(--color-primary)" }} className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: "50k+",    label: "Happy Customers" },
              { val: "200+",    label: "Partner Salons" },
              { val: "10k hrs", label: "Wait Time Saved" },
              { val: "Free",    label: "Always & Forever" },
            ].map(({ val, label }, i) => (
              <div key={i} className="p-4">
                <p className="text-4xl md:text-5xl font-black text-white leading-none mb-2">{val}</p>
                <p className="text-sm font-black text-white/60 uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. FINAL CTA ── */}
      <section style={{ background: "var(--color-bg-card)" }} className="py-32 text-center relative overflow-hidden">
        <div style={{ background: "color-mix(in srgb, var(--color-primary) 10%, transparent)" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h2 style={{ color: "var(--color-text)" }} className="text-4xl md:text-6xl font-black mb-6">
            Ready to skip the wait?
          </h2>
          <p style={{ color: "var(--color-text-muted)" }} className="mb-10 text-lg md:text-xl leading-relaxed">
            Create your free TrimTracker account and never waste time waiting at a salon again. Join thousands of smart customers today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/register")}
              className="btn-primary py-4 px-8 rounded-2xl text-lg hover:-translate-y-1 active:scale-95 shadow-xl">
              Get Started — It's Free
            </button>
            <button onClick={() => navigate("/salons")}
              style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
              className="py-4 px-8 rounded-2xl font-bold text-lg transition-all hover:-translate-y-1 active:scale-95">
              Browse Salons
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
