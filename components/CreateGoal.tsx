"use client";

import { supabase } from "@/lib/supabase-client";
import { useState } from "react";

export default function CreateGoal({ userId }: { userId: string }) {
  const [title, setTitle] = useState("");
  const [why, setWhy] = useState("");

  const createGoal = async () => {
    const { error } = await supabase.from("goals").insert({
      title,
      why,
      user_id: userId,
    });

    if (error) {
      alert(error.message);
      return;
    }

    location.reload();
  };

  return (
    <div className="mt-8 space-y-2">
      <input
        placeholder="Goal title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-2 text-black"
      />
      <input
        placeholder="Why does this matter?"
        value={why}
        onChange={(e) => setWhy(e.target.value)}
        className="p-2 text-black"
      />
      <button onClick={createGoal} className="bg-white text-black px-4 py-2">
        Create Goal
      </button>
    </div>
  );
}
