"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data } = await supabase
      .from("goals")
      .select("id, title, ai_report")
      .eq("user_id", userData.user.id)
      .not("ai_report", "is", null)
      .order("created_at", { ascending: false });

    if (data) setReports(data);

    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // 🔥 FORMATTER FUNCTION
  const formatReport = (text: string) => {
    if (!text) return null;

    const sections = text.split(/\n\s*\n/);

    return sections.map((section: string, i: number) => {
      const lines = section.split("\n");

      const title = lines[0]?.replace(":", "");
      const content = lines.slice(1);

      return (
        <div key={i} className="report-section">
          <div className="report-title">{title}</div>

          <div className="report-content">
            {content.map((line: string, idx: number) => {
              if (line.trim().startsWith("-")) {
                return (
                  <div key={idx} className="report-bullet">
                    <span className="bullet-dot" />
                    <span>{line.replace("-", "").trim()}</span>
                  </div>
                );
              }

              return (
                <p key={idx} className="report-text">
                  {line}
                </p>
              );
            })}
          </div>
        </div>
      );
    });
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

        h2 {
          font-family: 'Fraunces', serif;
          margin-bottom: 20px;
        }

        .goals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }

        .goal-card {
          background: white;
          border-radius: 18px;
          padding: 20px;
          min-height: 220px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.25s ease;
          border: 1px solid #ECEAE4;
          box-shadow:
            0 2px 6px rgba(0,0,0,0.05),
            0 10px 24px rgba(0,0,0,0.06);
        }

        .goal-card:hover {
          transform: translateY(-6px);
          border-color: var(--gold);
          box-shadow:
            0 4px 10px rgba(0,0,0,0.08),
            0 14px 30px rgba(0,0,0,0.10);
        }

        .goal-title {
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 10px;
          color: var(--ink);
        }

        .goal-desc {
          max-height: 240px;
          overflow-y: auto;
          padding-right: 6px;
        }

        /* REPORT STYLING */

        .report-section {
          margin-top: 14px;
          padding-top: 10px;
          border-top: 1px solid #F0EFEA;
        }

        .report-title {
          font-weight: 600;
          font-size: 13px;
          color: var(--sage);
          margin-bottom: 8px;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }

        .goal-card:hover .report-title {
          color: var(--gold);
        }

        .report-content {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .report-text {
          font-size: 13px;
          color: var(--ink);
          line-height: 1.5;
        }

        .report-bullet {
          display: flex;
          gap: 8px;
          align-items: flex-start;
          font-size: 13px;
          color: var(--ink);
        }

        .bullet-dot {
          width: 6px;
          height: 6px;
          background: var(--gold);
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .empty {
          color: var(--sage-light);
        }
      `}</style>

      <div style={{ padding: "40px", color: "black" }}>
        <h2>Reports</h2>

        {loading && <div>Loading...</div>}

        {!loading && reports.length === 0 && (
          <div className="empty">No reports yet.</div>
        )}

        <div className="goals-grid">
          {reports.map((goal) => (
            <div key={goal.id} className="goal-card">
              <div>
                <div className="goal-title">{goal.title}</div>

                <div className="goal-desc">{formatReport(goal.ai_report)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
