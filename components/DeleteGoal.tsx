"use client";

import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteGoal({ goalId }: { goalId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const deleteGoal = async () => {
    if (loading) return;

    const confirmed = confirm("Delete this goal?");
    if (!confirmed) return;

    setLoading(true);

    const { error } = await supabase.from("goals").delete().eq("id", goalId);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.refresh();
  };

  return (
    <button
      onClick={deleteGoal}
      disabled={loading}
      className="absolute top-3 right-3 text-neutral-400 hover:text-red-500 text-sm transition"
    >
      ✕
    </button>
  );
}
