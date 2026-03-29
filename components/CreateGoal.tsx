"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function CreateGoal({ onClose }: { onClose?: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const generateInsight = async (goal: string) => {
    try {
      const res = await fetch("/api/ai-insight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal }),
      });

      const data = await res.json();
      return data.insight || "Stay consistent and reflect on your progress.";
    } catch (err) {
      return "Stay consistent and reflect on your progress.";
    }
  };

  const createGoal = async () => {
    if (!title.trim() || loading) return;

    setLoading(true);

    const { data, error: userError } = await supabase.auth.getUser();

    if (userError || !data.user) {
      alert("User not authenticated");
      setLoading(false);
      return;
    }

    const user = data.user;

    //  Generate AI report FIRST
    const insight = await generateInsight(title);

    //  Insert goal WITH ai_report
    const { error } = await supabase.from("goals").insert({
      title,
      description,
      deadline: deadline || null,
      user_id: user.id,
      progress,
      ai_report: insight,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    // reset
    setTitle("");
    setDescription("");
    setDeadline("");
    setProgress(0);

    onClose?.();
    router.refresh();
  };

  return (
    <div className="relative w-[460px] max-w-full rounded-2xl bg-[#F7F6F3] border border-[#E5E3DE] shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex flex-col">
      <div className="px-7 pt-6 pb-4 border-b border-[#E5E3DE]">
        <h2 className="text-lg font-semibold text-black">New Goal</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Define something worth committing to.
        </p>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700"
        >
          ×
        </button>
      </div>

      <div className="px-7 py-6 space-y-6">
        <div>
          <label className="text-xs uppercase tracking-wide text-neutral-500 mb-2 block">
            Goal
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Run a 5K under 26 minutes"
            className="w-full bg-white border border-[#D9D6CF] rounded-xl px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-neutral-500 mb-2 block">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-white border border-[#D9D6CF] rounded-xl px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-neutral-500 mb-2 block">
            Deadline
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full bg-white border border-[#D9D6CF] rounded-xl px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-neutral-500 mb-3 block">
            Starting Progress — {progress}%
          </label>

          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="px-7 py-4 border-t flex justify-between">
        <button onClick={onClose}>Cancel</button>

        <button onClick={createGoal} disabled={loading || !title.trim()}>
          {loading ? "Creating..." : "Create Goal"}
        </button>
      </div>
    </div>
  );
}
