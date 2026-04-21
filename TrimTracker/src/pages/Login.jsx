// ============================================================
// pages/Login.jsx — Login Page
//
// OLD: loginUser() call pannitu token mattum localStorage-la save
// NEW: Redux-la user data-vum save pannrom!
//
// Redux functions used:
//   useDispatch() → action dispatch panna (store-la data maathura)
//   dispatch(loginSuccess({user, token})) → auth slice update
//   dispatch(setLoading(true/false)) → loading state manage
//   dispatch(setError("message")) → error state manage
// ============================================================

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { loginUser } from "../api/apiService";

// Redux hooks and actions import
import { useDispatch } from "react-redux";
import { loginSuccess, setLoading, setError, clearError } from "../store/reducers/authSlice";

const Login = () => {
  const navigate = useNavigate();

  // useDispatch = Redux store-ku action anuppura function
  const dispatch = useDispatch();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoadingLocal] = useState(false);
  const [error, setErrorLocal] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorLocal("");
    setLoadingLocal(true);

    // Redux-layum loading state set pannrom
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const data = await loginUser(form); // ← API call

      // ✅ Redux store-la user + token save pannrom!
      // Intha oru line-la authSlice-oda state full-a update aagum
      dispatch(loginSuccess({ user: data.user, token: data.token }));

      // Navigate based on role
      navigate(data.user.role === "owner" ? "/owner-dashboard" : "/salons");
    } catch (err) {
      setErrorLocal(err.message);
      dispatch(setError(err.message)); // Redux-layum error save
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
      <div className="card-glass animate-fadeInUp" style={{ width: "100%", maxWidth: "440px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span style={{ fontSize: "2.5rem" }}>✂️</span>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--color-text)", marginTop: "0.5rem" }}>
            Welcome Back
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginTop: "0.35rem" }}>
            Login to TrimTracker
          </p>
        </div>

        {/* Email/Password form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          <div>
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email" name="email"
              value={form.email} onChange={handleChange}
              placeholder="you@email.com" required
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
              <label className="form-label" style={{ margin: 0 }}>Password</label>
              <NavLink to="/forgot-password"
                style={{ fontSize: "0.78rem", color: "var(--color-secondary)", fontWeight: 600 }}>
                Forgot Password?
              </NavLink>
            </div>
            <input
              className="form-input"
              type="password" name="password"
              value={form.password} onChange={handleChange}
              placeholder="Your password" required
            />
          </div>

          {error && (
            <p style={{ color: "var(--color-danger)", fontSize: "0.875rem", fontWeight: 600 }}>
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit" className="btn-primary"
            style={{ marginTop: "0.5rem", width: "100%", opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
          New here?{" "}
          <NavLink to="/register" style={{ color: "var(--color-primary)", fontWeight: 700 }}>
            Create an account
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
