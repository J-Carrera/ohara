import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import CreateGoal from "@/components/CreateGoal";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🔥 TEMP DEV USER (replace with real UUID from Supabase)
  const devUserId = "d3a726ed-16ea-450c-9be1-b954fb57d49f";

  const activeUserId = user?.id ?? devUserId;

  const { data: goals, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", activeUserId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching goals:", error.message);
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-12 py-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-neutral-800">
            Your Goals
          </h1>
        </div>

        <CreateGoal userId={activeUserId} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals?.map((goal) => (
            <div
              key={goal.id}
              className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-neutral-800 mb-2">
                {goal.title}
              </h2>

              {goal.why && (
                <p className="text-sm text-neutral-500 mb-4">{goal.why}</p>
              )}

              <div className="text-xs text-neutral-400">
                Created {new Date(goal.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {goals?.length === 0 && (
          <p className="text-neutral-400 text-sm">
            No goals yet. Create your first one.
          </p>
        )}
      </div>
    </div>
  );
}
