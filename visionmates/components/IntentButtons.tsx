"use client";

import { useOptimistic, useTransition } from "react";
import Image from "next/image";
import anime from "animejs/lib/anime.es.js";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

type Level = "watch" | "raise" | "commit";

type Props = {
  initial?: Level | null;
  onSelect?: (level: Level) => Promise<void> | void;
};

export default function IntentButtons({ initial = null, onSelect }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimisticLevel, setOptimisticLevel] = useOptimistic<Level | null>(initial);
  const reduce = usePrefersReducedMotion();

  function burst(el: HTMLElement) {
    if (reduce) return;
    const colors = ["#FFD700", "#D64545", "#8B5A2B", "#3AA76D"]; // gold, accent, wood, success
    const particles = Array.from({ length: 6 }).map(() => {
      const p = document.createElement("span");
      p.style.position = "absolute";
      p.style.width = "6px";
      p.style.height = "6px";
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.left = "50%";
      p.style.top = "50%";
      p.style.transform = "translate(-50%, -50%)";
      p.style.pointerEvents = "none";
      p.style.imageRendering = "pixelated";
      return p;
    });
    const container = document.createElement("span");
    container.style.position = "absolute";
    container.style.left = "0";
    container.style.top = "0";
    container.style.right = "0";
    container.style.bottom = "0";
    container.style.overflow = "visible";
    container.style.pointerEvents = "none";
    particles.forEach((p) => container.appendChild(p));
    el.appendChild(container);
    anime({
      targets: particles,
      translateX: () => anime.random(-12, 12),
      translateY: () => anime.random(-12, 12),
      opacity: [{ value: 1, duration: 0 }, { value: 0, duration: 200 }],
      easing: "easeOutQuad",
      duration: 220,
      complete: () => container.remove(),
    });
  }

  function bounce(el: HTMLElement) {
    if (reduce) return;
    anime({ targets: el, scale: [1, 1.08, 1], duration: 180, easing: "easeOutQuad" });
  }

  function handleClick(level: Level, e: React.MouseEvent<HTMLButtonElement>) {
    setOptimisticLevel(level);
    if (!onSelect) return;
      startTransition(async () => {
        try {
          await onSelect(level);
        } catch {
          // revert on failure
          setOptimisticLevel(initial);
        }
      });
    const el = e.currentTarget;
    el.style.position = el.style.position || "relative";
    burst(el);
    bounce(el);
  }

  const base =
    "px-3 py-1 rounded pixel-shadow border border-stone-300 bg-white text-stone-800 hover:opacity-95";
  const active = "bg-accent text-parchment border-transparent";

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={(e) => handleClick("watch", e)}
        disabled={isPending}
        className={`${base} ${optimisticLevel === "watch" ? active : ""}`}
        aria-pressed={optimisticLevel === "watch"}
      >
        <Image src="/ui/icons/watch.png" alt="watch" width={16} height={16} className="mr-1" />
        watch
      </button>
      <button
        type="button"
        onClick={(e) => handleClick("raise", e)}
        disabled={isPending}
        className={`${base} ${optimisticLevel === "raise" ? active : ""}`}
        aria-pressed={optimisticLevel === "raise"}
      >
        <Image src="/ui/icons/raise.png" alt="raise" width={16} height={16} className="mr-1" />
        raise
      </button>
      <button
        type="button"
        onClick={(e) => handleClick("commit", e)}
        disabled={isPending}
        className={`${base} ${optimisticLevel === "commit" ? active : ""}`}
        aria-pressed={optimisticLevel === "commit"}
      >
        <Image src="/ui/icons/commit.png" alt="commit" width={16} height={16} className="mr-1" />
        commit
      </button>
    </div>
  );
}
