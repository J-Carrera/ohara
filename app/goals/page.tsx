"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import CreateGoal from "@/components/CreateGoal";
import DeleteGoal from "@/components/DeleteGoal";
import CompleteGoal from "@/components/CompleteGoal";

export default function ProjectsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
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
      .order("created_at", { ascending: false });

    if (!error && data) {
      setGoals(data);
    }

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
        }
      
        body {
          color: black;
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
          align-items: center;
          margin-bottom: 36px;
        }

        .left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .title {
          font-family: 'Fraunces', serif;
          font-size: 28px;
          color: var(--ink);
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

        .button {
          background: var(--sage);
          color: white;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .button:hover {
          background: var(--ink);
        }

        .feed {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .card {
          position: relative;
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
          color: black;
          font-size: 14px;
          line-height: 1.5;
        }

        .meta {
          margin-top: 12px;
          font-size: 12px;
          color: var(--sage-light);
          opacity: 0.7;
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
            <button
              onClick={() => router.push("/profile")}
              className="back-button"
            >
              ← Profile
            </button>

            <div className="title">Your Projects</div>
          </div>

          <button onClick={() => setShowModal(true)} className="button">
            + New Goal
          </button>
        </div>

        <div className="feed">
          {loading && <div className="empty">Loading...</div>}

          {!loading && goals.length === 0 && (
            <div className="empty">You haven’t created any goals yet.</div>
          )}

          {goals.map((goal) => (
            <div key={goal.id} className="card">
              <DeleteGoal goalId={goal.id} />

              <div className="goal-title">{goal.title}</div>

              {goal.description && (
                <div className="goal-description">{goal.description}</div>
              )}

              <div className="meta">
                Created {new Date(goal.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <CreateGoal
              onClose={() => {
                setShowModal(false);
                fetchGoals();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
