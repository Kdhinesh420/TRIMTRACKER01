

import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import dark from "../assets/night-mode.png";
import light from "../assets/day-mode.png";

// Redux hooks and action
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/reducers/authSlice";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Redux-la irundu user data read pannrom!
  // useSelector = store-oda state-la irundu oru part edukkalaam
  const user = useSelector((state) => state.auth.user);

  // useDispatch = action-a store-ku anuppuvom
  const dispatch = useDispatch();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.body.classList.toggle("light", next === "light");
  };

  // Logout handler — Redux store-la user-a clear panniduvom
  const handleLogout = () => {
    dispatch(logout()); // ← authSlice-oda logout action call
    navigate("/");       // Home page-ku redirect
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors px-1 ${isActive
      ? "text-[var(--color-primary)]"
      : scrolled
        ? "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        : "text-slate-300 hover:text-white"
    }`;

  return (
    <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        transition: "background 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease",
        background: scrolled ? "var(--color-bg-card)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        boxShadow: scrolled ? "0 1px 0 var(--color-border)" : "none",
        padding: scrolled ? "0.75rem 0" : "1.5rem 0",
      }}
    >
      <div className="container flex items-center justify-between gap-4">

        {/* ---- LOGO ---- */}
        <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="text-3xl"><img src="" alt="" /></span>
          <div>
            <p className="text-base font-black tracking-tight leading-none"
              style={{ color: "var(--color-text)" }}>
              TRIM<span style={{ color: "var(--color-primary)" }}>TRACKER</span>
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "var(--color-text-muted)" }}>
              Smart Salon Waiting
            </p>
          </div>
        </NavLink>

        {/* ---- DESKTOP NAV LINKS ---- */}
        <nav className="hidden md:flex items-center gap-7">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/salons" className={linkClass}>Find Salons</NavLink>
          <NavLink to="/how-it-works" className={linkClass}>How It Works</NavLink>

          {/* Owner → Dashboard link */}
          {user && user.role === "owner" && (
            <NavLink to="/owner-dashboard" className={linkClass}>
              📊 Dashboard
            </NavLink>
          )}

          {/* Customer → Queue link */}
          {user && user.role === "customer" && (
            <NavLink to="/queue" className={linkClass}>
              👥 My Queue
            </NavLink>
          )}
        </nav>

        {/* ---- RIGHT: Theme toggle + Auth buttons ---- */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title="Toggle Theme"
            style={{
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
              borderRadius: "0.5rem",
              padding: "0.45rem 0.65rem",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "all 0.2s",
            }}
          >
            {theme === "dark" ? <img className="w-5 h-5" src={dark} alt="" /> : <img className="w-5 h-5" src={light} alt="" />}
          </button>

          {/* ✅ Redux user irunthucha check pannrom! */}
          {user ? (
            <>
              {/* User logged in — show name and logout */}
              <span style={{
                color: "var(--color-text)",
                fontWeight: 600,
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}>
                👤 {user.name}
                {/* Owner badge show pannrom */}
                {user.role === "owner" && (
                  <span style={{
                    background: "var(--color-primary)",
                    color: "#fff",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    padding: "0.15rem 0.4rem",
                    borderRadius: "0.25rem",
                    textTransform: "uppercase",
                  }}>Owner</span>
                )}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "1.5px solid var(--color-border)",
                  color: "var(--color-text-muted)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  padding: "0.55rem 1.35rem",
                  borderRadius: "0.6rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* User not logged in — show Login and Sign Up */}
              <NavLink to="/login"
                style={{ color: "var(--color-text-muted)", fontWeight: 600, fontSize: "0.875rem" }}
                className="hover:text-white transition-colors px-2">
                Login
              </NavLink>
              <NavLink to="/register" className="btn-primary" style={{ padding: "0.55rem 1.35rem", fontSize: "0.875rem", borderRadius: "0.6rem" }}>
                Sign Up
              </NavLink>
            </>
          )}
        </div>

        {/* ---- MOBILE HAMBURGER ---- */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ color: "var(--color-text)" }}
        >
          <span style={{ display: "block", width: "22px", height: "2px", background: "currentColor", transition: "transform 0.3s", transform: menuOpen ? "rotate(45deg) translateY(5px)" : "none" }} />
          <span style={{ display: "block", width: "22px", height: "2px", background: "currentColor", opacity: menuOpen ? 0 : 1, transition: "opacity 0.2s" }} />
          <span style={{ display: "block", width: "22px", height: "2px", background: "currentColor", transition: "transform 0.3s", transform: menuOpen ? "rotate(-45deg) translateY(-5px)" : "none" }} />
        </button>
      </div>

      {/* ---- MOBILE DROPDOWN MENU ---- */}
      {menuOpen && (
        <div
          className="md:hidden animate-fadeInUp"
          style={{
            background: "var(--color-bg-card)",
            borderTop: "1px solid var(--color-border)",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {[
            { to: "/", label: "Home" },
            { to: "/salons", label: "Find Salons" },
            { to: "/how-it-works", label: "How It Works" },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === "/"}
              style={{ fontWeight: 600, color: "var(--color-text)", padding: "0.5rem 0", borderBottom: "1px solid var(--color-border)" }}>
              {label}
            </NavLink>
          ))}

          {/* Mobile: Owner → Dashboard link */}
          {user && user.role === "owner" && (
            <NavLink to="/owner-dashboard"
              style={{ fontWeight: 600, color: "var(--color-primary)", padding: "0.5rem 0", borderBottom: "1px solid var(--color-border)" }}>
              📊 Dashboard
            </NavLink>
          )}

          {/* Mobile: Customer → Queue link */}
          {user && user.role === "customer" && (
            <NavLink to="/queue"
              style={{ fontWeight: 600, color: "var(--color-primary)", padding: "0.5rem 0", borderBottom: "1px solid var(--color-border)" }}>
              👥 My Queue
            </NavLink>
          )}

          {/* Mobile auth section — Redux user check */}
          {user ? (
            <>
              <div style={{ fontWeight: 600, color: "var(--color-text)", padding: "0.5rem 0", borderBottom: "1px solid var(--color-border)" }}>
                👤 {user.name}
              </div>
              <button
                onClick={handleLogout}
                className="btn-primary"
                style={{ marginTop: "0.5rem", textAlign: "center", background: "var(--color-danger)" }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login"
                style={{ fontWeight: 600, color: "var(--color-text)", padding: "0.5rem 0", borderBottom: "1px solid var(--color-border)" }}>
                Login
              </NavLink>
              <NavLink to="/register" className="btn-primary" style={{ marginTop: "0.5rem", textAlign: "center" }}>
                Sign Up Free
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
