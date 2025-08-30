import AuthGate from "@/components/AuthGate";
import { createServerClient } from "@/lib/supabase/server";
import NotifyBell from "@/components/NotifyBell";

async function DashboardContent() {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session!.user.id;

  const [{ data: myProjects }, { data: myIntents }, { data: myNotifs }] = await Promise.all([
    supabase
      .from("projects")
      .select("id,title,summary,created_at")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("project_intents")
      .select("project_id,level")
      .eq("user_id", userId),
    supabase
      .from("notifications")
      .select("id,type,is_read,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading text-wood">Dashboard</h1>
        <NotifyBell count={(myNotifs ?? []).filter((n: any) => !n.is_read).length} />
      </div>
      <section className="paper pixel-border rounded p-4">
        <h2 className="text-xl font-heading text-wood mb-3">My Projects</h2>
        <ul className="space-y-2">
          {(myProjects ?? []).map((p) => (
            <li key={p.id} className="text-stone-800">
              <a href={`/projects/${p.id}`} className="text-wood underline">
                {p.title}
              </a>
              <span className="text-stone-600"> — {p.summary}</span>
            </li>
          ))}
          {(!myProjects || myProjects.length === 0) && (
            <li className="text-stone-600">No projects yet.</li>
          )}
        </ul>
      </section>

      <section className="paper pixel-border rounded p-4">
        <h2 className="text-xl font-heading text-wood mb-3">My Intents</h2>
        <ul className="space-y-2">
          {(myIntents ?? []).map((i) => (
            <li key={i.project_id} className="text-stone-800">
              Project {i.project_id} — {i.level}
            </li>
          ))}
          {(!myIntents || myIntents.length === 0) && (
            <li className="text-stone-600">No intents yet.</li>
          )}
        </ul>
      </section>

      <section className="paper pixel-border rounded p-4">
        <h2 className="text-xl font-heading text-wood mb-3">Notifications</h2>
        <ul className="space-y-2">
          {(myNotifs ?? []).map((n) => (
            <li key={n.id} className="text-stone-800">
              [{n.type}] {new Date(n.created_at).toLocaleString()} {n.is_read ? "(read)" : ""}
            </li>
          ))}
          {(!myNotifs || myNotifs.length === 0) && (
            <li className="text-stone-600">No notifications.</li>
          )}
        </ul>
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGate>
      <DashboardContent />
    </AuthGate>
  );
}
