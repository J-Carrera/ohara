"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
export default function Login() {
  const [email, setEmail] = useState("");

  const signIn = async () => {
    await supabase.auth.signInWithOtp({ email });
    alert("Check your email for login link.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="space-y-4">
        <input
          className="p-2 text-black"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={signIn} className="bg-white text-black px-4 py-2">
          Sign In
        </button>
      </div>
    </div>
  );
}
