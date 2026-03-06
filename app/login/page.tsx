"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const signIn = async () => {
    if (!email || loading) return;

    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSent(true);
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
        }

        .o-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 64px;
        }

        .o-wordmark {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          font-weight: 600;
          color: var(--sage);
          margin-bottom: 32px;
        }

        .o-hero-heading {
          font-family: 'Fraunces', serif;
          font-size: 52px;
          font-weight: 300;
          line-height: 1.1;
          margin-bottom: 24px;
        }

        .o-hero-heading strong {
          font-weight: 600;
          color: var(--sage);
        }

        .o-hero-sub {
          font-size: 15px;
          font-weight: 300;
          color: var(--sage-light);
          max-width: 360px;
          line-height: 1.7;
        }

        .o-right {
          width: 460px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px;
        }

        .o-card {
          width: 100%;
          background: white;
          border-radius: 16px;
          padding: 44px 40px;
          box-shadow:
            0 1px 2px rgba(28,36,32,0.04),
            0 8px 32px rgba(28,36,32,0.07);
        }

        .o-card-title {
          font-family: 'Fraunces', serif;
          font-size: 26px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .o-card-sub {
          font-size: 13px;
          font-weight: 300;
          color: var(--sage-light);
          margin-bottom: 32px;
        }

        .o-label {
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 8px;
          display: block;
        }

        .o-input {
          width: 100%;
          padding: 13px 16px;
          background: var(--cream);
          border: 1.5px solid transparent;
          border-radius: 10px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          margin-bottom: 16px;
        }

        .o-input:focus {
          border-color: var(--sage);
          background: white;
        }

        .o-btn {
          width: 100%;
          padding: 14px;
          background: var(--sage);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .o-btn:hover:not(:disabled) {
          background: var(--ink);
        }

        .o-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .o-sent {
          margin-top: 16px;
          padding: 12px;
          background: var(--sage-pale);
          border-radius: 10px;
          font-size: 13px;
          color: var(--sage);
        }

        .o-error {
          margin-top: 12px;
          font-size: 12px;
          color: #b91c1c;
        }
      `}</style>

      <div className="o-root">
        <div className="o-left">
          <div className="o-wordmark">Ohara</div>
          <h1 className="o-hero-heading">
            Build the life <br />
            <strong>you're aiming for.</strong>
          </h1>
          <p className="o-hero-sub">
            Set meaningful goals, track progress, and stay focused on what
            matters.
          </p>
        </div>

        <div className="o-right">
          <div className="o-card">
            <h2 className="o-card-title">Welcome back</h2>
            <p className="o-card-sub">
              Sign in with a magic link — no password needed.
            </p>

            <label className="o-label">Email address</label>
            <input
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
                Check your inbox — your magic link is on its way.
              </div>
            )}

            {errorMessage && <div className="o-error">{errorMessage}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
