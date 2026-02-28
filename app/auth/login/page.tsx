"use client";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LoginPage() {
  const [Error, setError] = useState<string>("");
  const [IsLoading, setIsLoading] = useState<boolean>(false);
  const [User, setUser] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    return setUser({
      ...User,
      [name]: value,
    });
  };

  const router = useRouter();

  const handleLogIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: User.email,
        password: User.password,
      });
      if (error) throw error;
      router.push("/");
    } catch (error: any) {
      console.error("Error while logging in handleLogIn func:", error);
      setError(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <header className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-tr from-white/8 to-white/5 flex items-center justify-center shadow-sm">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path d="M2 12L22 3L13 22L10 14L2 12Z" fill="#E6F7FF" />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-white">StarDrop</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to your files</p>
        </header>

        <section className="relative bg-slate-800/60 backdrop-blur-md rounded-xl p-6 shadow-md">
          {Error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-in fade-in slide-in-from-top-1 duration-200">
              {Error}
            </div>
          )}
          <form className="space-y-4" onSubmit={e => handleLogIn(e)}>
            <label className="block">
              <span className="text-sm text-slate-300">Email</span>
              <input
                className="mt-2 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2"
                placeholder="you@example.com"
                aria-label="Email"
                value={User.email}
                name="email"
                onChange={(e) => handleUserChange(e)}
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-300">Password</span>
              <input
                type="password"
                className="mt-2 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2"
                placeholder="••••••••"
                aria-label="Password"
                value={User.password}
                onChange={(e) => handleUserChange(e)}
                name="password"
              />
            </label>

            <button
              type="submit"
              disabled={IsLoading}
              className="w-full mt-2 py-3 rounded-full text-white font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#169fda" }}
            >
              {IsLoading ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <a
              className="text-sm text-slate-400 hover:text-white"
              href="/auth/register"
            >
              Create an account
            </a>
          </div>

          <div className="pointer-events-none absolute -right-8 -top-12 opacity-30">
            <svg
              width="220"
              height="220"
              viewBox="0 0 220 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="110" cy="110" r="110" fill="#0f1724" />
              <g opacity="0.6" fill="#113148">
                <rect x="40" y="60" width="120" height="80" rx="12" />
                <path d="M60 80H160" stroke="#164A66" strokeWidth="2" />
              </g>
            </svg>
          </div>
        </section>
      </div>
    </main>
  );
}
