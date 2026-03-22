"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import CreateGoal from "@/components/CreateGoal";

export default function ProjectBoard() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  // Close modal on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // 🔥 LOGOUT FUNCTION
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert("Error logging out");
      return;
    }

    router.push("/login");
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
        }

        .nav button:hover {
          background: rgba(255,255,255,0.22);
        }

        .main {
          flex: 1;
          padding: 48px 56px;
        }

        .card {
          background: white;
          border-radius: 18px;
          padding: 28px;
          box-shadow:
            0 1px 2px rgba(28,36,32,0.04),
            0 8px 28px rgba(28,36,32,0.08);
        }

        .overview {
          margin-bottom: 28px;
        }

        .create-btn {
          margin: 18px 0 36px;
          padding: 12px 20px;
          border-radius: 10px;
          border: 1px solid var(--sage);
          background: var(--sage);
          color: white;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .create-btn:hover {
          background: var(--ink);
          transform: translateY(-1px);
        }

        .grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 26px;
        }

        .right-stack {
          display: flex;
          flex-direction: column;
          gap: 26px;
        }

        h2 {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          margin-bottom: 10px;
        }

        ul {
          padding-left: 18px;
          color: var(--sage-light);
        }

        /* ✨ MODAL */

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }

        .modal-content {
          animation: scaleIn 0.25s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      <div className="layout">
        {/* Sidebar */}
        <div className="sidebar">
          <div>
            <div className="brand">OHARA</div>

            <div className="nav">
              <button>Projects</button>
              <button>Report</button>
              <button>Feed</button>
              <button>Peers</button>
              <button>Legacy</button>
            </div>
          </div>

          <div className="nav">
            <button>Account</button>
            <button>Settings</button>
            {/* ✅ LOGOUT BUTTON */}
            <button onClick={handleLogout}>Log Out</button>
          </div>
        </div>

        {/* Main */}
        <div className="main">
          <div className="card overview">
            <h2>Project Overview</h2>
            <ul>
              <li>List of current goals</li>
              <li>General goal description</li>
            </ul>
          </div>

          <button className="create-btn" onClick={() => setShowModal(true)}>
            Create New Goal +
          </button>

          <div className="grid">
            <div className="card">
              <h2>Goals & Objectives</h2>
              <ul>
                <li>Statistical goal description</li>
                <li>Reasoning / meaning for each</li>
              </ul>
            </div>

            <div className="right-stack">
              <div className="card">
                <h2>Productivity Tracker</h2>
                <ul>
                  <li>Goals created</li>
                  <li>Goals completed</li>
                  <li>Avg goal duration</li>
                </ul>
              </div>

              <div className="card">
                <h2>Daily Check In</h2>
                <ul>
                  <li>Track new progress</li>
                  <li>Identify over/under achievements</li>
                  <li>Sense of well-being</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✨ MODAL */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <CreateGoal
              userId={"YOUR_USER_ID"}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
