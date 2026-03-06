"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function CreateGoal({ userId }: { userId: string }) {
  const [title, setTitle] = useState("");
  const [why, setWhy] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createGoal = async () => {
    if (!title.trim() || loading) return;

    setLoading(true);

    const { error } = await supabase.from("goals").insert({
      title,
      why,
      user_id: userId,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");
    setWhy("");

    // 🔥 Re-fetch server data
    router.refresh();
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm max-w-xl">
      <h2 className="text-lg font-semibold text-neutral-800 mb-4">
        Create New Goal
      </h2>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-neutral-500 block mb-1">
            Goal Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Run a 5K under 26 minutes"
            className="w-full rounded-lg border border-neutral-200 px-4 py-2 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/40 transition"
          />
        </div>

        <div>
          <label className="text-sm text-neutral-500 block mb-1">
            Why does this matter?
          </label>
          <textarea
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            placeholder="Improve endurance and discipline"
            rows={3}
            className="w-full rounded-lg border border-neutral-200 px-4 py-2 text-sm text-black placeholder:text-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-600/40 transition"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={createGoal}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "+ Create Goal"}
          </button>
        </div>
      </div>
    </div>
  );
}
