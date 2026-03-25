"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import CreateGoal from "@/components/CreateGoal";

export default function ProjectBoard() {
  const [showModal, setShowModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const [goals, setGoals] = useState<any[]>([]);
  const [loadingGoals, setLoadingGoals] = useState(true);

  const router = useRouter();

  const fetchGoals = async () => {
    setLoadingGoals(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setLoadingGoals(false);
      return;
    }

    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (!error && data) setGoals(data);

    setLoadingGoals(false);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (!showLogoutConfirm) return;

    if (countdown === 0) {
      handleLogout();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, showLogoutConfirm]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return alert("Error logging out");
    router.push("/login");
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setCountdown(30);
  };

  return (
    <>
      <style>{`
        :root {
          --sage: #4A5E52;
          --sage-light: #6B7F72;
          --sage-pale: #EBF0EC;
          --cream: #FAF8F4;
          --ink: #1C2420;
          --gold: #C8A96E;
        }

        body {
          background: var(--cream);
          font-family: 'Geist', sans-serif;
        }

        .layout {
          display: flex;
          min-height: 100vh;
        }

        .sidebar {
          width: 220px;
          background: var(--sage);
          color: white;
          padding: 28px 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .brand {
          font-family: 'Fraunces', serif;
          font-size: 18px;
          margin-bottom: 32px;
        }

        .nav button {
          width: 100%;
          margin-bottom: 12px;
          padding: 10px;
          border: none;
          border-radius: 8px;
          background: rgba(255,255,255,0.12);
          color: white;
          cursor: pointer;
          font-size: 14px;
          transition: 0.2s;
        }

        .nav button:hover {
          background: rgba(255,255,255,0.25);
        }

        .main {
          flex: 1;
          padding: 48px;
        }

        h2 {
          font-family: 'Fraunces', serif;
          margin-bottom: 16px;
        }

        /* MAIN GRID LAYOUT */
        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 28px;
        }

        .right-stack {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .card {
        color: black;
          background: white;
          border-radius: 18px;
          padding: 24px;
          box-shadow:
            0 2px 6px rgba(0,0,0,0.05),
            0 10px 24px rgba(0,0,0,0.08);
        }

        /* GOALS GRID */
        .goals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 18px;
        }

        .goal-card {
          background: var(--sage-pale);
          border-radius: 14px;
          padding: 16px;
          min-height: 150px;

          display: flex;
          flex-direction: column;
          justify-content: space-between;

          transition: 0.2s;
        }

        .goal-card:hover {
          transform: translateY(-3px);
          background: white;
        }

        .goal-title {
          font-weight: 600;
          font-size: 15px;
          margin-bottom: 6px;
        }

        .goal-desc {
          font-size: 13px;
          color: var(--sage-light);
        }

        .goal-footer {
          font-size: 12px;
          color: var(--sage-light);
        }

        ul {
          padding-left: 18px;
          color: var(--sage-light);
        }

        .empty {
          color: var(--sage-light);
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <div className="layout">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div>
            <div className="brand">OHARA</div>

            <div className="nav">
              <button onClick={() => router.push("/goals")}>My Goals</button>
              <button onClick={() => router.push("/feed")}>Feed</button>
              <button>Report</button>
              <button>Peers</button>
              <button>Legacy</button>
            </div>
          </div>

          <div className="nav">
            <button>Account</button>
            <button>Settings</button>
            <button onClick={handleLogoutClick}>Log Out</button>
          </div>
        </div>

        {/* MAIN */}
        <div className="main">
          <div className="dashboard-grid">
            {/* LEFT: GOALS */}
            <div className="card">
              <h2>Current Goals</h2>

              {loadingGoals && <div className="empty">Loading...</div>}

              {!loadingGoals && goals.length === 0 && (
                <div className="empty">No goals yet.</div>
              )}

              {!loadingGoals && goals.length > 0 && (
                <div className="goals-grid">
                  {goals.map((goal) => (
                    <div key={goal.id} className="goal-card">
                      <div>
                        <div className="goal-title">{goal.title}</div>
                        {goal.description && (
                          <div className="goal-desc">{goal.description}</div>
                        )}
                      </div>

                      <div className="goal-footer">Active</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT SIDE */}
            <div className="right-stack">
              <div className="card">
                <h2>Productivity Tracker</h2>
                <ul>
                  <li>Goals created: {goals.length}</li>
                  <li>Goals completed: 0</li>
                  <li>Avg goal duration: —</li>
                </ul>
              </div>

              <div className="card">
                <h2>Daily Check In</h2>
                <ul>
                  <li>Track progress</li>
                  <li>Identify patterns</li>
                  <li>Stay consistent</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LOGOUT MODAL */}
      {showLogoutConfirm && (
        <div className="modal-backdrop">
          <div
            style={{
              background: "white",
              padding: "28px",
              borderRadius: "16px",
              width: "320px",
              textAlign: "center",
            }}
          >
            <h3>Confirm Logout</h3>
            <p>You will be logged out in {countdown}s</p>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>

              <button onClick={handleLogout} style={{ flex: 1 }}>
                Log Out Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
