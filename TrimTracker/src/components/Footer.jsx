// ============================================================
// components/Footer.jsx
// All pages-oda bottom part. Dark background always.
// ============================================================

import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={{ background: "#0f172a", borderTop: "1px solid #1e293b", color: "#94a3b8" }}>
      <div className="container" style={{ padding: "4rem 1.5rem 2rem" }}>

        {/* Top 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">✂️</span>
              <p className="text-lg font-black" style={{ color: "#f8fafc" }}>
                TRIM<span style={{ color: "var(--color-primary)" }}>TRACKER</span>
              </p>
            </div>
            <p className="text-sm leading-relaxed" style={{ maxWidth: "280px" }}>
              No more wasted time at the salon. Join the live virtual queue and arrive exactly on time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: "#f8fafc" }}>
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/salons", label: "Find Salons" },
                { to: "/how-it-works", label: "How It Works" },
                { to: "/register", label: "Sign Up Free" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <NavLink to={to} className="hover:text-amber-400 transition-colors">
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: "#f8fafc" }}>
              Contact
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>📧 support@trimtracker.com</li>
              <li>📍 Chennai, Tamil Nadu</li>
              <li>📱 +91 98765 43210</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{ borderTop: "1px solid #1e293b", paddingTop: "1.5rem", textAlign: "center", fontSize: "0.8rem" }}>
          © 2026 TrimTracker. Made with ❤️ in Tamil Nadu — Skip the wait, not the salon.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
