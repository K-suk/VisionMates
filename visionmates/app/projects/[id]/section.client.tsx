"use client";

import { useState } from "react";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";

type Comment = {
  id: string;
  body: string;
  author_name?: string;
  author_id?: string;
  created_at?: string;
};

export default function ClientComments({ initialComments }: { initialComments: Comment[] }) {
  const [items, setItems] = useState<Comment[]>(initialComments);

  async function onSubmit(values: { body: string }) {
    const temp: Comment = {
      id: `temp-${Date.now()}`,
      body: values.body,
      author_name: "You",
      created_at: new Date().toISOString(),
    };
    setItems((prev) => [temp, ...prev]);
    // Optionally: call server action here to persist; omitted for placeholder tests.
  }

  return (
    <section className="paper pixel-border rounded p-4 space-y-4">
      <h3 className="text-lg font-heading text-wood mb-2">Comments</h3>
      <CommentList comments={items} />
      <CommentForm onSubmit={onSubmit} />
    </section>
  );
}

