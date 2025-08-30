"use client";

import { useState } from "react";
import { projectSchema } from "@/lib/validators/project";

export default function NewProjectForm({ action }: { action: (formData: FormData) => void }) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const values = { title, summary, description, tags: [] as string[] };
    const parsed = projectSchema.safeParse(values);
    if (!parsed.success) {
      e.preventDefault();
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
    } else {
      setError(null);
    }
  }

  return (
    <form action={action} onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-stone-800" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 w-full px-3 py-2 rounded border border-stone-300 bg-white text-stone-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-800" htmlFor="summary">
          Summary
        </label>
        <input
          id="summary"
          name="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
          className="mt-1 w-full px-3 py-2 rounded border border-stone-300 bg-white text-stone-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-800" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full px-3 py-2 rounded border border-stone-300 bg-white text-stone-900"
        />
      </div>
      {error && <p className="text-sm text-accent">{error}</p>}
      <button className="bg-wood text-parchment px-4 py-2 rounded pixel-shadow" type="submit">
        Create Project
      </button>
    </form>
  );
}
