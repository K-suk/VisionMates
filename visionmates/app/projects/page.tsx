import { createServerClient } from "@/lib/supabase/server";
import ProjectCard from "@/components/ProjectCard";

type SearchParams = {
  q?: string;
  tag?: string; // tag id as string
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = createServerClient();

  const q = (searchParams.q ?? "").trim();
  const tagId = searchParams.tag ? Number(searchParams.tag) : undefined;

  // Fetch tags for the filter UI
  const { data: tags } = await supabase.from("tags").select("id,name").order("name");

  let projectIdsByTag: string[] | undefined = undefined;
  if (tagId && !Number.isNaN(tagId)) {
    const { data: tagRows } = await supabase
      .from("project_tags")
      .select("project_id")
      .eq("tag_id", tagId);
    projectIdsByTag = (tagRows ?? []).map((r: any) => r.project_id);
    if (projectIdsByTag.length === 0) projectIdsByTag = ["00000000-0000-0000-0000-000000000000"]; // no results guard
  }

  let query = supabase
    .from("projects")
    .select("id,title,summary,created_at")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (q) query = query.ilike("title", `%${q}%`);
  if (projectIdsByTag) query = query.in("id", projectIdsByTag);

  const { data: projects, error } = await query;
  if (error) {
    // Non-fatal: render empty state
    // console.error(error);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-heading text-wood mb-4">Projects</h1>

      <form className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3" method="get">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search projects..."
          className="px-3 py-2 rounded border border-stone-300 bg-white text-stone-900"
        />
        <select
          name="tag"
          defaultValue={tagId ?? ""}
          className="px-3 py-2 rounded border border-stone-300 bg-white text-stone-900"
        >
          <option value="">All tags</option>
          {(tags ?? []).map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <button className="bg-wood text-parchment px-3 py-2 rounded pixel-shadow">
          Filter
        </button>
      </form>

      <ul className="space-y-4">
        {(projects ?? []).map((p) => (
          <li key={p.id}>
            <ProjectCard id={p.id} title={p.title} summary={p.summary} tags={[]} />
          </li>
        ))}
        {(!projects || projects.length === 0) && (
          <li className="text-stone-600">No projects found.</li>
        )}
      </ul>
    </div>
  );
}
