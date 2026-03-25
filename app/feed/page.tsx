"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

export default function FeedPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setGoals(data || []);
    else console.error(error);
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
        }

        body {
          background: var(--cream);
          font-family: 'Geist', sans-serif;
        }

        .container {
          max-width: 760px;
          margin: 0 auto;
          padding: 56px 24px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 36px;
        }

        .left {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .top-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .title {
          font-family: 'Fraunces', serif;
          font-size: 28px;
          color: var(--ink);
        }

        .subtitle {
          color: var(--sage-light);
          font-size: 14px;
        }

        .back-button {
          font-size: 13px;
          color: var(--sage-light);
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 6px 10px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .back-button:hover {
          color: var(--ink);
          background: var(--sage-pale);
          transform: translateX(-2px);
        }

        .feed {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .card {
          background: white;
          border-radius: 16px;
          padding: 20px 22px;
          border: 1px solid var(--sage-pale);
          box-shadow:
            0 1px 2px rgba(28,36,32,0.04),
            0 6px 20px rgba(28,36,32,0.06);
          transition: all 0.2s ease;
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 4px 12px rgba(28,36,32,0.08),
            0 10px 30px rgba(28,36,32,0.10);
        }

        .goal-title {
          font-weight: 600;
          font-size: 16px;
          color: var(--ink);
          margin-bottom: 6px;
        }

        .goal-description {
          color: var(--sage-light);
          font-size: 14px;
          line-height: 1.5;
        }

        .meta {
          margin-top: 12px;
          font-size: 12px;
          color: var(--sage-light);
          opacity: 0.7;
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .author {
          font-weight: 500;
          color: var(--ink);
          opacity: 0.85;
        }

        .empty {
          text-align: center;
          color: var(--sage-light);
          margin-top: 60px;
        }
      `}</style>

      <div className="container">
        <div className="header">
          <div className="left">
            <div className="top-row">
              <button
                onClick={() => router.push("/profile")}
                className="back-button"
              >
                ← Profile
              </button>

              <div className="title">Community Feed</div>
            </div>

            <div className="subtitle">See what others are working toward</div>
          </div>
        </div>

        <div className="feed">
          {goals.length === 0 && <div className="empty">No goals yet...</div>}

          {goals.map((goal) => (
            <div key={goal.id} className="card">
              <div className="goal-title">{goal.title}</div>

              {goal.description && (
                <div className="goal-description">{goal.description}</div>
              )}

              <div className="meta">
                <span className="author">
                  {goal.email?.split("@")[0] || "unknown"}
                </span>
                • {new Date(goal.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
