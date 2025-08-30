import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import IntentButtons from "@/components/IntentButtons";
import UpdateTimeline from "@/components/UpdateTimeline";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";
import ClientComments from "./section.client";

export default async function ProjectDetail({ params }: { params: { id: string } }) {
  const supabase = createServerClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id,title,summary,description,owner_id,created_at")
    .eq("id", params.id)
    .single();

  if (!project) return notFound();

  const { data: updates } = await supabase
    .from("project_updates")
    .select("id,author_id,body,created_at")
    .eq("project_id", project.id)
    .order("created_at", { ascending: false });

  const { data: comments } = await supabase
    .from("project_comments")
    .select("id,author_id,body,created_at")
    .eq("project_id", project.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <header className="paper pixel-border rounded p-4">
        <h1 className="text-3xl font-heading text-wood">{project.title}</h1>
        <p className="text-stone-700">{project.summary}</p>
      </header>
      <section className="paper pixel-border rounded p-4">
        <h2 className="text-xl font-heading text-wood mb-2">Intent</h2>
        <IntentButtons initial={null} onSelect={async () => {}} />
      </section>
      {project.description && (
        <section className="paper pixel-border rounded p-4">
          <h2 className="text-xl font-heading text-wood mb-2">Description</h2>
          <p className="whitespace-pre-wrap text-stone-800">{project.description}</p>
        </section>
      )}
      <section className="paper pixel-border rounded p-4">
        <h3 className="text-lg font-heading text-wood mb-2">Updates</h3>
        <UpdateTimeline updates={(updates ?? []) as any} />
      </section>
      <ClientComments initialComments={(comments ?? []) as any} />
    </div>
  );
}
