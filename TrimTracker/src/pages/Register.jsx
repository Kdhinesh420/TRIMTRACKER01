// ============================================================
// pages/Register.jsx — Sign Up Page
//
// OLD: registerUser() call pannitu token mattum localStorage-la save
// NEW: Redux-la user data-vum save pannrom!
//
// Redux functions used:
//   useDispatch() → action dispatch panna
//   dispatch(registerSuccess({user, token})) → auth slice update
// ============================================================

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { registerUser } from "../api/apiService";

// Redux hooks and actions
import { useDispatch } from "react-redux";
import { registerSuccess, setLoading, setError, clearError } from "../store/reducers/authSlice";

const Register = () => {
  const navigate = useNavigate();

  // useDispatch = Redux store-ku action anuppura function
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", role: "",
  });

  const [loading, setLoadingLocal] = useState(false);
  const [error, setErrorLocal] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const selectRole = (role) => setForm((prev) => ({ ...prev, role }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role) { setErrorLocal("Please select your account type."); return; }
    setErrorLocal("");
    setLoadingLocal(true);

    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const data = await registerUser(form); // ← API call

      // ✅ Redux store-la user + token save!
      dispatch(registerSuccess({ user: data.user, token: data.token }));

      navigate(data.user.role === "owner" ? "/salon-setup" : "/queue");
    } catch (err) {
      setErrorLocal(err.message);
      dispatch(setError(err.message));
    } finally {
      setLoadingLocal(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "6rem 1.5rem 3rem",
    }}>
      <div className="card-glass animate-fadeInUp" style={{ width: "100%", maxWidth: "480px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span style={{ fontSize: "2.5rem" }}>✂️</span>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--color-text)", marginTop: "0.5rem" }}>
            Create Your Account
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginTop: "0.4rem" }}>
            TrimTracker — Free for everyone
          </p>
        </div>

        {/* Role Selection Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.75rem" }}>
          {[
            { value: "customer", icon: "🙋", label: "I am a Customer" },
            { value: "owner", icon: "💈", label: "I am a Salon Owner" },
          ].map(({ value, icon, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => selectRole(value)}
              style={{
                padding: "1rem 0.75rem",
                borderRadius: "0.85rem",
                border: form.role === value
                  ? "2px solid var(--color-primary)"
                  : "2px solid var(--color-border)",
                background: form.role === value
                  ? "rgba(245,158,11,0.10)"
                  : "var(--color-bg-card)",
                color: "var(--color-text)",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              <div style={{ fontSize: "1.75rem", marginBottom: "0.35rem" }}>{icon}</div>
              {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {[
            { name: "name", type: "text", label: "Full Name", placeholder: "Dhinesh Kumar" },
            { name: "email", type: "email", label: "Email Address", placeholder: "you@email.com" },
            { name: "phone", type: "tel", label: "Phone Number", placeholder: "+91 98765 43210" },
            { name: "password", type: "password", label: "Password", placeholder: "Create a strong password" },
          ].map(({ name, type, label, placeholder }) => (
            <div key={name}>
              <label className="form-label">{label}</label>
              <input
                className="form-input"
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required
              />
            </div>
          ))}

          {error && (
            <p style={{ color: "var(--color-danger)", fontSize: "0.875rem", fontWeight: 600 }}>
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{ marginTop: "0.5rem", width: "100%", opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up →"}
          </button>
        </form>

        {/* Login link */}
        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
          Already have an account?{" "}
          <NavLink to="/login" style={{ color: "var(--color-primary)", fontWeight: 700 }}>Log in</NavLink>
        </p>
      </div>
    </div>
  );
};

export default Register;
