"use client";

import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CompleteGoal({ goalId }: { goalId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const markComplete = async () => {
    if (loading) return;

    setLoading(true);

    const { error } = await supabase
      .from("goals")
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq("id", goalId);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.refresh();
  };

  return (
    <button
      onClick={markComplete}
      disabled={loading}
      className="absolute bottom-3 right-3 text-xs px-3 py-1.5 rounded-lg bg-[#2E3A32] text-black hover:bg-[#243029] transition"
    >
      ✓ Complete
    </button>
  );
}
