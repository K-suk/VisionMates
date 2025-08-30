"use client";

import { useState } from "react";
import { commentSchema } from "@/lib/validators/comment";

type Props = {
  onSubmit: (values: { body: string }) => Promise<void> | void;
};

export default function CommentForm({ onSubmit }: Props) {
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = commentSchema.safeParse({ body });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    try {
      setPending(true);
      await onSubmit(parsed.data);
      setBody("");
    } catch (e: any) {
      setError(e?.message ?? "Failed to submit comment");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Leave a comment..."
        className="w-full px-3 py-2 rounded border border-stone-300 bg-white text-stone-900"
      />
      {error && <p className="text-sm text-accent">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="bg-wood text-parchment px-3 py-1 rounded pixel-shadow"
      >
        Post Comment
      </button>
    </form>
  );
}
