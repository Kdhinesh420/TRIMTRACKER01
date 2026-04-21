// ============================================================
// pages/HowItWorks.jsx — How It Works & Help Page (#8)
//
// 3 visual steps + FAQ accordion + Contact form
// ============================================================

import React, { useState } from "react";

// FAQ data — Easy to update!
const faqs = [
  {
    q: "Is TrimTracker really free?",
    a: "Yes! TrimTracker is 100% free for customers. Salon owners also get a free plan with all core features.",
  },
  {
    q: "How accurate is the wait time?",
    a: "Wait times are estimated based on live queue data. As services get completed, your time updates in real-time.",
  },
  {
    q: "Can I cancel my queue position?",
    a: "Yes, you can cancel anytime from the Live Queue page. This frees up your spot for others.",
  },
  {
    q: "How does the salon owner get notified?",
    a: "The owner sees your booking appear immediately in their dashboard. They can update your status as they serve each customer.",
  },
];

// ---- FAQ Accordion Item ----
const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false); // open = true shows answer

  return (
    <div style={{ borderBottom: "1px solid var(--color-border)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", textAlign: "left",
          padding: "1.1rem 0",
          background: "none", border: "none",
          color: "var(--color-text)", fontWeight: 700,
          fontSize: "1rem", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}
      >
        {q}
        <span style={{ color: "var(--color-primary)", fontSize: "1.25rem", transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "none" }}>
          +
        </span>
      </button>
      {/* Conditionally show answer */}
      {open && (
        <p style={{
          color: "var(--color-text-muted)", fontSize: "0.9rem",
          lineHeight: 1.7, paddingBottom: "1rem",
        }}>
          {a}
        </p>
      )}
    </div>
  );
};

const HowItWorks = () => {
  // Simple contact form state
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleContact = (e) => {
    e.preventDefault();
    // TODO: POST to /api/support/contact
    console.log("Contact form:", contactForm);
    setSent(true);
  };

  return (
    <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>

      {/* ============================================================
          HERO
          ============================================================ */}
      <section style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
        padding: "8rem 1.5rem 5rem",
        textAlign: "center",
      }}>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#fff", marginBottom: "1rem" }}>
          How TrimTracker Works
        </h1>
        <p style={{ color: "#93c5fd", fontSize: "1.1rem", maxWidth: "520px", margin: "0 auto" }}>
          Three simple steps. No download needed. Works on any browser.
        </p>
      </section>

      {/* ============================================================
          3 VISUAL STEPS
          ============================================================ */}
      <section className="section-pad">
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {[
              {
                num: "01",
                icon: "🔍",
                title: "Find & Join Queue",
                desc: "Open TrimTracker and search for salons near you. See their live queue status, current wait time, and available services. Tap 'Join Queue' to instantly grab your spot — no phone calls needed.",
                color: "#22c55e",
              },
              {
                num: "02",
                icon: "📊",
                title: "Track Your Live Position",
                desc: "After joining, your dashboard shows your real-time queue number and estimated wait time. It refreshes automatically as the queue moves. You'll know exactly when to head out.",
                color: "var(--color-primary)",
              },
              {
                num: "03",
                icon: "🚶",
                title: "Arrive Exactly on Time",
                desc: "Leave your home only when it's almost your turn. Walk straight to the chair when you arrive. No awkward waits. No crowded waiting rooms. Just your haircut, exactly on time.",
                color: "#3b82f6",
              },
            ].map(({ num, icon, title, desc, color }, i) => (
              <div
                key={num}
                className="card animate-fadeInUp"
                style={{
                  display: "flex",
                  flexDirection: i % 2 === 0 ? "row" : "row-reverse",
                  gap: "2.5rem",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {/* Icon side */}
                <div style={{
                  flex: "0 0 auto",
                  width: "120px", height: "120px",
                  borderRadius: "50%",
                  background: `${color}15`,
                  border: `2px solid ${color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "3rem",
                }}>
                  {icon}
                </div>
                {/* Text side */}
                <div style={{ flex: 1, minWidth: "240px" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 800, color, textTransform: "uppercase", letterSpacing: "0.1em" }}>Step {num}</span>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--color-text)", margin: "0.35rem 0 0.75rem" }}>{title}</h3>
                  <p style={{ color: "var(--color-text-muted)", lineHeight: 1.75, fontSize: "0.95rem" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FAQ ACCORDION
          ============================================================ */}
      <section className="section-pad" style={{ background: "var(--color-bg-card)" }}>
        <div className="container" style={{ maxWidth: "720px" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "var(--color-text)", marginBottom: "2rem", textAlign: "center" }}>
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

     
      
    </div>
  );
};

export default HowItWorks;
