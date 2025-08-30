import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import AvatarPixel from "@/components/AvatarPixel";

export default async function PublicProfile({ params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id,display_name,bio,skills,links,created_at")
    .eq("id", params.id)
    .single();

  if (!profile) return notFound();

  const { data: projects } = await supabase
    .from("projects")
    .select("id,title,summary,created_at")
    .eq("owner_id", profile.id)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <header className="paper pixel-border rounded p-4">
        <div className="flex items-center gap-3">
          <AvatarPixel size={48} />
          <h1 className="text-3xl font-heading text-wood">{profile.display_name}</h1>
        </div>
        {profile.bio && <p className="text-stone-700">{profile.bio}</p>}
      </header>

      <section className="paper pixel-border rounded p-4">
        <h2 className="text-xl font-heading text-wood mb-2">Projects</h2>
        <ul className="space-y-2">
          {(projects ?? []).map((p) => (
            <li key={p.id}>
              <Link className="text-wood underline" href={`/projects/${p.id}`}>
                {p.title}
              </Link>
              <span className="text-stone-600"> — {p.summary}</span>
            </li>
          ))}
          {(!projects || projects.length === 0) && (
            <li className="text-stone-600">No public projects.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
