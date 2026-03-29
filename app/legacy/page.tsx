"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function LegacyPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetchCompletedGoals();
  }, []);

  const fetchCompletedGoals = async () => {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userData.user.id)
      .eq("completed", true)
      .order("completed_at", { ascending: false });

    if (!error && data) setGoals(data);

    setLoading(false);
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

        .card {
          color: black;
          background: white;
          border-radius: 18px;
          padding: 24px;
          box-shadow:
            0 2px 6px rgba(0,0,0,0.05),
            0 10px 24px rgba(0,0,0,0.08);
        }

        .goals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 18px;
        }

        .goal-card {
          background: var(--sage-pale);
          border-radius: 16px;
          padding: 18px;
          min-height: 170px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .goal-card:hover {
          transform: translateY(-4px);
          background: white;
          border-color: var(--gold);
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

        .goal-desc-spaced {
          margin-bottom: 12px;
        }

        .goal-progress {
          margin-bottom: 10px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: var(--sage-light);
          margin-bottom: 5px;
        }

        .progress-bar {
          background: #DAD7D0;
          border-radius: 999px;
          height: 6px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--sage);
          border-radius: 999px;
        }

        .goal-footer-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 8px;
          border-top: 1px solid #E5E3DE;
        }

        .deadline {
          color: var(--sage-light);
        }

        .status-pill {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 999px;
          font-weight: 500;
        }

        .status-pill.complete {
          background: #D4EDDA;
          color: #2E6B3E;
        }

        .empty {
          color: var(--sage-light);
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
              <button onClick={() => router.push("/legacy")}>Legacy</button>
            </div>
          </div>

          <div className="nav">
            <button>Account</button>
            <button>Settings</button>
          </div>
        </div>

        {/* MAIN */}
        <div className="main">
          <div className="card">
            <h2>Your Legacy</h2>

            {loading && <div className="empty">Loading...</div>}

            {!loading && goals.length === 0 && (
              <div className="empty">No completed goals yet.</div>
            )}

            {!loading && goals.length > 0 && (
              <div className="goals-grid">
                {goals.map((goal) => {
                  const completedDate = goal.completed_at
                    ? new Date(goal.completed_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : null;

                  return (
                    <div key={goal.id} className="goal-card">
                      <div>
                        <div className="goal-title">{goal.title}</div>

                        {goal.description && (
                          <div className="goal-desc goal-desc-spaced">
                            {goal.description}
                          </div>
                        )}

                        <div className="goal-progress">
                          <div className="progress-header">
                            <span>Completed</span>
                            <span>100%</span>
                          </div>

                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{ width: "100%" }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="goal-footer-row">
                        <span className="deadline">
                          {completedDate
                            ? `Finished ${completedDate}`
                            : "Completed"}
                        </span>

                        <span className="status-pill complete">Completed</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
