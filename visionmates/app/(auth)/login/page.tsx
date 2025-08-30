"use client";

import { useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { Mail, LogIn } from "lucide-react";

export default function LoginPage() {
  const supabase = createBrowserClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const callbackUrl = `${origin}/callback`;

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: callbackUrl,
        },
      });
      if (error) throw error;
      setMessage("Check your email for a magic sign-in link.");
    } catch (err: any) {
      setMessage(err?.message ?? "Failed to send magic link");
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    setLoading(true);
    setMessage(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
        },
      });
      if (error) throw error;
      // Redirect handled by Supabase
      return data;
    } catch (err: any) {
      setMessage(err?.message ?? "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 p-6">
      <div className="paper pixel-border rounded-md p-6 w-full max-w-sm">
        <h1 className="text-2xl font-heading text-wood mb-4">Welcome, traveler</h1>
        <p className="text-sm text-stone-700 mb-4">Sign in to enter the tavern.</p>
        <form onSubmit={signInWithEmail} className="flex flex-col gap-3">
          <label className="text-sm font-medium text-stone-800" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-3 py-2 rounded border border-stone-300 focus:outline-none focus:ring-2 focus:ring-gold bg-white text-stone-900"
            placeholder="you@example.com"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center gap-2 px-3 py-2 rounded bg-wood text-parchment hover:opacity-95 pixel-shadow"
          >
            <Mail size={16} /> Send magic link
          </button>
        </form>
        <div className="my-4 h-px bg-stone-300" />
        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded bg-accent text-parchment hover:opacity-95 pixel-shadow"
        >
          <LogIn size={16} /> Continue with Google
        </button>
        {message && (
          <p className="mt-4 text-sm text-stone-700" role="status">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

