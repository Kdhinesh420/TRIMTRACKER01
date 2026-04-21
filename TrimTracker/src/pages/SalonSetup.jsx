import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSalon } from "../api/apiService";

const SalonSetup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    salonName: "",
    district: "", // New required field
    address: "",
    license: "",
  });

  const [services, setServices] = useState([
    { serviceName: "", price: "", estimatedDurationMins: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (index, field, value) => {
    const newServices = [...services];
    newServices[index][field] = value;
    setServices(newServices);
  };

  const addService = () => {
    setServices([...services, { serviceName: "", price: "", estimatedDurationMins: "" }]);
  };

  const removeService = (index) => {
    const newServices = services.filter((_, i) => i !== index);
    setServices(newServices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!form.salonName || !form.district || !form.address) {
      setError("Please fill in Salon Name, District and Address.");
      setLoading(false);
      return;
    }

    const formattedServices = services.map((s) => ({
      serviceName: s.serviceName,
      price: Number(s.price),
      estimatedDurationMins: Number(s.estimatedDurationMins),
    }));

    // check if any service is invalid
    const invalidService = formattedServices.find(
      (s) => !s.serviceName || isNaN(s.price) || isNaN(s.estimatedDurationMins)
    );

    if (invalidService) {
      setError("Please fill all service details correctly (Price and Time must be numbers).");
      setLoading(false);
      return;
    }

    try {
      await createSalon({
        salonName: form.salonName,
        district: form.district,
        address: form.address,
        license: form.license,
        services: formattedServices,
      });

      // Navigate to dashboard after success
      navigate("/owner-dashboard");
    } catch (err) {
      setError(err.message || "Failed to create salon account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "var(--color-bg)" }} className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div style={{ background: "color-mix(in srgb, var(--color-bg-card) 85%, transparent)", border: "1px solid var(--color-border)" }}
        className="max-w-2xl w-full mx-auto backdrop-blur-lg rounded-2xl p-6 sm:p-10 shadow-2xl">

        <div className="text-center mb-8">
          <span className="text-4xl inline-block mb-2">🏪</span>
          <h1 style={{ color: "var(--color-text)" }} className="text-3xl font-black">Setup Your Salon</h1>
          <p style={{ color: "var(--color-text-muted)" }} className="text-sm mt-2">Enter your store details to start taking customers</p>
        </div>

        {error && (
          <div style={{ background: "color-mix(in srgb, var(--color-danger) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--color-danger) 40%, transparent)", color: "var(--color-danger)" }}
            className="px-4 py-3 rounded-lg mb-6 text-sm font-semibold flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Basic Details */}
          <div className="space-y-5">
            <h2 style={{ color: "var(--color-text)", borderBottom: "1px solid var(--color-border)" }} className="text-lg font-bold pb-2 flex items-center gap-2">
              <span style={{ color: "var(--color-primary)" }}>📝</span> Store Details
            </h2>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label style={{ color: "var(--color-text-muted)" }} className="block text-sm font-bold mb-2">Salon / Store Name</label>
                <input type="text" name="salonName" value={form.salonName} onChange={handleFormChange}
                  placeholder="E.g., Star Hair Stylists" required
                  style={{ background: "var(--color-bg-input)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
                  className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-all placeholder:opacity-50" />
              </div>
              <div>
                <label style={{ color: "var(--color-text-muted)" }} className="block text-sm font-bold mb-2">District</label>
                <select name="district" value={form.district} onChange={handleFormChange} required
                  style={{ background: "var(--color-bg-input)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
                  className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-all cursor-pointer">
                  <option value="">Select District</option>
                  {[
                    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Thanjavur", "Nagercoil", "Dindigul", "Hosur", "Kanchipuram", "Karaikudi", "Kumbakonam", "Namakkal", "Pudukkottai", "Sivakasi", "Tanjore", "Theni", "Tiruppur", "Vaniyambadi", "Virudhunagar"
                  ].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: "var(--color-text-muted)" }} className="block text-sm font-bold mb-2">Store Address</label>
                <textarea name="address" value={form.address} onChange={handleFormChange}
                  placeholder="Full address of your shop" rows="3" required
                  style={{ background: "var(--color-bg-input)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
                  className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-all resize-none placeholder:opacity-50" />
              </div>
              <div>
                <label style={{ color: "var(--color-text-muted)" }} className="block text-sm font-bold mb-2">
                  License Number <span className="font-normal opacity-60">(Optional)</span>
                </label>
                <input type="text" name="license" value={form.license} onChange={handleFormChange}
                  placeholder="Business License No."
                  style={{ background: "var(--color-bg-input)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
                  className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-all placeholder:opacity-50" />
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="space-y-5">
            <div style={{ borderBottom: "1px solid var(--color-border)" }} className="pb-2">
              <h2 style={{ color: "var(--color-text)" }} className="text-lg font-bold flex items-center gap-2">
                <span style={{ color: "var(--color-primary)" }}>✂️</span> Services Provided
              </h2>
              <p style={{ color: "var(--color-text-muted)" }} className="text-xs mt-1">Add the services you offer and the estimated time taken.</p>
            </div>

            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={index}
                  style={{ background: "var(--color-bg-input)", border: "1px solid var(--color-border)" }}
                  className="rounded-xl p-5 relative group transition-all">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                    <div className="sm:col-span-6">
                      <label style={{ color: "var(--color-text-muted)" }} className="block text-xs font-bold mb-1.5 uppercase tracking-wider">Service Name</label>
                      <input type="text" value={service.serviceName}
                        onChange={(e) => handleServiceChange(index, "serviceName", e.target.value)}
                        placeholder="e.g. Premium Hair Cut" required
                        style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
                        className="w-full rounded-lg px-3 py-2.5 focus:outline-none text-sm transition-all" />
                    </div>
                    <div className="sm:col-span-3">
                      <label style={{ color: "var(--color-text-muted)" }} className="block text-xs font-bold mb-1.5 uppercase tracking-wider">Price (₹)</label>
                      <input type="number" value={service.price}
                        onChange={(e) => handleServiceChange(index, "price", e.target.value)}
                        placeholder="150" required min="0"
                        style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
                        className="w-full rounded-lg px-3 py-2.5 focus:outline-none text-sm transition-all" />
                    </div>
                    <div className="sm:col-span-3">
                      <label style={{ color: "var(--color-text-muted)" }} className="block text-xs font-bold mb-1.5 uppercase tracking-wider">Time (Mins)</label>
                      <input type="number" value={service.estimatedDurationMins}
                        onChange={(e) => handleServiceChange(index, "estimatedDurationMins", e.target.value)}
                        placeholder="30" required min="1"
                        style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
                        className="w-full rounded-lg px-3 py-2.5 focus:outline-none text-sm transition-all" />
                    </div>
                  </div>

                  {services.length > 1 && (
                    <button type="button" onClick={() => removeService(index)}
                      style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)", color: "var(--color-danger)" }}
                      className="absolute -top-3 -right-3 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold transition-all shadow-md z-10"
                      title="Remove this service">×</button>
                  )}
                </div>
              ))}
            </div>

            <button type="button" onClick={addService}
              style={{ color: "var(--color-primary)", background: "color-mix(in srgb, var(--color-primary) 10%, transparent)" }}
              className="font-bold text-sm flex items-center gap-1.5 transition-colors px-4 py-2 rounded-lg">
              <span>+</span> Add Another Service
            </button>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={loading}
              style={{ background: "var(--color-primary)", color: "#fff" }}
              className="w-full font-black py-4 px-6 rounded-xl transition-all disabled:opacity-50 text-base sm:text-lg flex justify-center items-center gap-2 shadow-lg">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving Details...
                </span>
              ) : (
                "Complete Setup & Open Dashboard"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SalonSetup;
