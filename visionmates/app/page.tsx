import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center p-8">
      <div className="w-full max-w-3xl text-center paper pixel-border rounded-md p-8">
        <h1 className="text-4xl sm:text-5xl font-heading text-wood mb-4">
          VisionMates Tavern
        </h1>
        <p className="text-stone-700 mb-6">
          Discover projects, gather allies, and bring ideas to life.
        </p>
        <Link
          href="/projects"
          className="inline-block bg-wood text-parchment px-5 py-3 rounded pixel-shadow hover:opacity-95"
        >
          Explore Projects
        </Link>
      </div>
    </main>
  );
}
