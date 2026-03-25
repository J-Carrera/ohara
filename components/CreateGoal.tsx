"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function CreateGoal({ onClose }: { onClose?: () => void }) {
  const [title, setTitle] = useState("");
  const [why, setWhy] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createGoal = async () => {
    if (!title.trim() || loading) return;

    setLoading(true);

    //  Get authenticated user safely
    const { data, error: userError } = await supabase.auth.getUser();

    if (userError || !data.user) {
      alert("User not authenticated");
      setLoading(false);
      return;
    }

    const user = data.user;

    //  Insert goal tied to user
    const { error } = await supabase.from("goals").insert({
      title,
      description: why,
      user_id: user.id,
      email: user.email,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    //  Reset form
    setTitle("");
    setWhy("");

    //  Better UX flow
    onClose?.();
    router.refresh();
  };

  return (
    <div className="relative bg-white border border-neutral-200 rounded-2xl p-6 shadow-xl max-w-xl w-[420px]">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-neutral-400 hover:text-black text-lg"
      >
        ×
      </button>

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
            onKeyDown={(e) => {
              if (e.key === "Enter") createGoal();
            }}
            placeholder="Run a 5K under 26 minutes"
            className="w-full rounded-lg border border-neutral-200 px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-emerald-600/40"
          />
        </div>

        <div>
          <label className="text-sm text-neutral-500 block mb-1">
            Why does this matter?
          </label>
          <textarea
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            rows={3}
            placeholder="Improve endurance and discipline"
            className="w-full rounded-lg border border-neutral-200 px-4 py-2 text-sm text-black resize-none focus:outline-none focus:ring-2 focus:ring-emerald-600/40"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={createGoal}
            disabled={loading || !title.trim()}
            className="px-5 py-2 rounded-lg bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "+ Create Goal"}
          </button>
        </div>
      </div>
    </div>
  );
}
