import AuthGate from "@/components/AuthGate";
import NewProjectForm from "@/components/forms/NewProjectForm";
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { projectSchema } from "@/lib/validators/project";

export default function NewProjectPage() {
  async function createProject(formData: FormData) {
    "use server";
    const supabase = createServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) redirect("/login");

    const values = {
      title: String(formData.get("title") ?? "").trim(),
      summary: String(formData.get("summary") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      tags: [] as string[],
    };
    const parsed = projectSchema.safeParse(values);
    if (!parsed.success) return;

    const { data, error } = await supabase
      .from("projects")
      .insert({
        owner_id: session.user.id,
        title: parsed.data.title,
        summary: parsed.data.summary,
        description: parsed.data.description || null,
        is_public: true,
      })
      .select("id")
      .single();

    if (!error && data?.id) {
      redirect(`/projects/${data.id}`);
    }
  }

  return (
    <AuthGate>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-heading text-wood mb-4">New Project</h1>
        <div className="paper pixel-border rounded p-4">
          <NewProjectForm action={createProject} />
        </div>
      </div>
    </AuthGate>
  );
}
