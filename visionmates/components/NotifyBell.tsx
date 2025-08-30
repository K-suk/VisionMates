"use client";

import { useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import anime from "animejs/lib/anime.es.js";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

export default function NotifyBell({ count = 0 }: { count?: number }) {
  const ref = useRef<SVGSVGElement | null>(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current || count <= 0) return;
    anime({
      targets: ref.current,
      rotate: [0, -8, 8, -5, 5, -2, 2, 0],
      duration: 600,
      easing: "easeInOutSine",
    });
  }, [count, reduce]);

  return (
    <div className="relative inline-flex items-center">
      <Bell ref={ref} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 text-xs grid place-items-center bg-accent text-parchment rounded-full pixel-shadow">
          {count}
        </span>
      )}
    </div>
  );
}
