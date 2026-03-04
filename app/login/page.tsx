"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const signIn = async () => {
    if (!email || loading) return;
    setLoading(true);
    await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    setSent(true);
    alert("Check your email for login link.");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300;1,9..144,600&family=Geist:wght@300;400;500&display=swap');

        :root {
          --sage: #4A5E52;
          --sage-light: #6B7F72;
          --sage-pale: #EBF0EC;
          --cream: #FAF8F4;
          --ink: #1C2420;
          --gold: #C8A96E;
          --gold-pale: #F5EDD8;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: var(--cream); }

        .o-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Geist', sans-serif;
          color: var(--ink);
          background: var(--cream);
          position: relative;
        }

        /* Ambient background rings — like a target/goal */
        .o-rings {
          position: fixed;
          top: 50%;
          right: -80px;
          transform: translateY(-50%);
          width: 700px;
          height: 700px;
          pointer-events: none;
          z-index: 0;
        }

        .o-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid var(--sage-pale);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .o-ring:nth-child(1) { width: 700px; height: 700px; }
        .o-ring:nth-child(2) { width: 520px; height: 520px; opacity: 0.8; }
        .o-ring:nth-child(3) { width: 360px; height: 360px; opacity: 0.6; }
        .o-ring:nth-child(4) { width: 200px; height: 200px; opacity: 0.4; border-color: var(--sage-light); }
        .o-ring:nth-child(5) { width: 60px; height: 60px; background: var(--sage-pale); border: none; opacity: 0.6; }

        /* Left content pane */
        .o-left {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px 64px 52px;
          max-width: 560px;
        }

        .o-wordmark {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .o-wordmark-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--sage);
        }

        .o-wordmark-text {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          font-weight: 600;
          color: var(--sage);
          letter-spacing: 0.02em;
        }

        .o-hero {
          padding: 20px 0;
        }

        .o-hero-label {
          display: inline-block;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold);
          background: var(--gold-pale);
          padding: 5px 12px;
          border-radius: 20px;
          margin-bottom: 28px;
        }

        .o-hero-heading {
          font-family: 'Fraunces', serif;
          font-size: clamp(42px, 5vw, 72px);
          font-weight: 300;
          line-height: 1.05;
          color: var(--ink);
          margin-bottom: 24px;
        }

        .o-hero-heading strong {
          font-weight: 600;
          color: var(--sage);
          display: block;
        }

        .o-hero-sub {
          font-size: 15px;
          font-weight: 300;
          color: var(--sage-light);
          line-height: 1.75;
          max-width: 340px;
        }

        /* Goal milestones decoration */
        .o-milestones {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .o-milestone {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 0;
          border-bottom: 1px solid var(--sage-pale);
          animation: fadeUp 0.5s ease both;
        }

        .o-milestone:nth-child(1) { animation-delay: 0.1s; }
        .o-milestone:nth-child(2) { animation-delay: 0.2s; }
        .o-milestone:nth-child(3) { animation-delay: 0.3s; }

        .o-milestone-check {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1.5px solid var(--sage-light);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 10px;
          color: white;
        }

        .o-milestone-check.done {
          background: var(--sage);
          border-color: var(--sage);
        }

        .o-milestone-text {
          font-size: 13px;
          font-weight: 300;
          color: var(--sage-light);
        }

        .o-milestone-text.done {
          color: var(--ink);
          font-weight: 400;
        }

        /* Right form pane */
        .o-right {
          position: relative;
          z-index: 1;
          width: 440px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 52px;
        }

        .o-card {
          width: 100%;
          background: white;
          border-radius: 16px;
          padding: 44px 40px;
          box-shadow:
            0 1px 2px rgba(28,36,32,0.04),
            0 8px 32px rgba(28,36,32,0.07),
            0 32px 64px rgba(28,36,32,0.04);
          animation: cardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .o-card-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--sage-pale);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .o-card-icon svg {
          width: 22px;
          height: 22px;
          stroke: var(--sage);
          fill: none;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .o-card-title {
          font-family: 'Fraunces', serif;
          font-size: 26px;
          font-weight: 600;
          color: var(--ink);
          margin-bottom: 6px;
          line-height: 1.15;
        }

        .o-card-sub {
          font-size: 13px;
          font-weight: 300;
          color: var(--sage-light);
          margin-bottom: 36px;
          line-height: 1.6;
        }

        .o-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: var(--ink);
          margin-bottom: 8px;
        }

        .o-input {
          width: 100%;
          padding: 13px 16px;
          background: var(--cream);
          border: 1.5px solid transparent;
          border-radius: 10px;
          font-family: 'Geist', sans-serif;
          font-size: 14px;
          font-weight: 300;
          color: var(--ink);
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          margin-bottom: 12px;
        }

        .o-input::placeholder { color: #B0BAB5; }

        .o-input:focus {
          border-color: var(--sage);
          background: white;
        }

        .o-btn {
          width: 100%;
          margin-top: 4px;
          padding: 14px;
          background: var(--sage);
          color: white;
          border: none;
          border-radius: 10px;
          font-family: 'Geist', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          letter-spacing: 0.01em;
        }

        .o-btn:hover:not(:disabled) {
          background: var(--ink);
          transform: translateY(-1px);
        }

        .o-btn:active:not(:disabled) { transform: translateY(0); }

        .o-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .o-sent {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 14px;
          padding: 12px 14px;
          background: var(--sage-pale);
          border-radius: 10px;
          font-size: 13px;
          color: var(--sage);
          font-weight: 400;
          animation: fadeUp 0.3s ease both;
        }

        .o-sent-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--sage);
          flex-shrink: 0;
        }

        .o-divider {
          height: 1px;
          background: var(--sage-pale);
          margin: 28px 0;
        }

        .o-fine {
          font-size: 12px;
          font-weight: 300;
          color: #B0BAB5;
          line-height: 1.65;
          text-align: center;
        }

        @media (max-width: 860px) {
          .o-root { flex-direction: column; align-items: center; }
          .o-left { max-width: 100%; padding: 36px 32px 0; }
          .o-rings { display: none; }
          .o-right { width: 100%; max-width: 480px; padding: 24px 24px 48px; }
        }
      `}</style>

      <div className="o-root">
        {/* Decorative concentric rings */}
        <div className="o-rings">
          <div className="o-ring" />
          <div className="o-ring" />
          <div className="o-ring" />
          <div className="o-ring" />
          <div className="o-ring" />
        </div>

        {/* Left brand panel */}
        <div className="o-left">
          <div className="o-wordmark">
            <div className="o-wordmark-dot" />
            <span className="o-wordmark-text">Ohara</span>
          </div>

          <div className="o-hero">
            <span className="o-hero-label">Goal Setting, Reimagined</span>
            <h1 className="o-hero-heading">
              Build the life
              <br />
              <strong>you're aiming for.</strong>
            </h1>
            <p className="o-hero-sub">
              Ohara helps you set meaningful goals, track your progress, and
              stay focused on what actually matters.
            </p>
          </div>

          <div className="o-milestones">
            <div className="o-milestone">
              <div className="o-milestone-check done">✓</div>
              <span className="o-milestone-text done">
                Define your north star
              </span>
            </div>
            <div className="o-milestone">
              <div className="o-milestone-check done">✓</div>
              <span className="o-milestone-text done">
                Break it into milestones
              </span>
            </div>
            <div className="o-milestone">
              <div className="o-milestone-check" />
              <span className="o-milestone-text">Show up every day</span>
            </div>
          </div>
        </div>

        {/* Right form card */}
        <div className="o-right">
          <div className="o-card">
            <div className="o-card-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="4" />
                <line x1="12" y1="3" x2="12" y2="1" />
                <line x1="12" y1="23" x2="12" y2="21" />
                <line x1="3" y1="12" x2="1" y2="12" />
                <line x1="23" y1="12" x2="21" y2="12" />
              </svg>
            </div>

            <h2 className="o-card-title">Welcome back</h2>
            <p className="o-card-sub">
              Sign in with a magic link — no password needed.
            </p>

            <label className="o-label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              className="o-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && signIn()}
            />

            <button
              className="o-btn"
              onClick={signIn}
              disabled={loading || !email}
            >
              {loading
                ? "Sending link…"
                : sent
                  ? "Resend magic link"
                  : "Continue with email →"}
            </button>

            {sent && (
              <div className="o-sent">
                <div className="o-sent-dot" />
                Check your inbox — link is on its way
              </div>
            )}

            <div className="o-divider" />
            <p className="o-fine">
              We'll send a one-time link to your email.
              <br />
              No password, no hassle.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
