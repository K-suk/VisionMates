"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

type Props = {
  id: string;
  title: string;
  summary: string;
  tags?: { id: number; name: string }[];
  counts?: { watch?: number; raise?: number; commit?: number };
};

export default function ProjectCard({ id, title, summary, tags = [], counts }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current) return;
    const el = ref.current;
    el.style.opacity = "0";
    el.style.transform = "scale(0.98)";
    anime({
      targets: el,
      opacity: [0, 1],
      scale: [0.98, 1],
      easing: "easeOutQuad",
      duration: 500,
    });
  }, [reduce]);

  return (
    <div ref={ref} className="paper pixel-border rounded p-4 pixel-shadow">
      <h3 className="text-xl font-heading text-wood mb-1">
        <Link href={`/projects/${id}`}>{title}</Link>
      </h3>
      <p className="text-stone-700 mb-3">{summary}</p>
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t.id} className="px-2 py-0.5 text-xs rounded bg-gold/20 text-stone-800 pixel-border">
              {t.name}
            </span>
          ))}
          {tags.length === 0 && (
            <span className="text-xs text-stone-500">No tags</span>
          )}
        </div>
        {counts && (
          <div className="text-sm text-stone-700 flex gap-3">
            <span>👀 {counts.watch ?? 0}</span>
            <span>✋ {counts.raise ?? 0}</span>
            <span>🚀 {counts.commit ?? 0}</span>
          </div>
        )}
      </div>
    </div>
  );
}
