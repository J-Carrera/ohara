import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import CreateGoal from "@/components/CreateGoal";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: goals } = await supabase
    .from("goals")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-black text-white p-10 space-y-6">
      <h1 className="text-3xl font-bold">Your Goals</h1>

      <CreateGoal userId={user?.id ?? "dev-user"} />

      <div className="space-y-4">
        {goals?.map((goal) => (
          <div key={goal.id} className="bg-zinc-900 p-4 rounded-xl">
            <h2 className="text-xl font-semibold">{goal.title}</h2>
            <p className="text-zinc-400">{goal.why}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
