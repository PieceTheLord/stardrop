"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { toast, Toaster } from "sonner";

export default function Page() {
  const [User, setUser] = useState<{
    email: string;
    password: string;
    checkPsw: string;
    tonWallet: string;
  }>({
    email: "",
    password: "",
    checkPsw: "",
    tonWallet: "",
  });
  const [Loading, setLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUser({
      ...User,
      [name]: value,
    });

    if ((name === "checkPsw" || name === "password") && User.password.length < 6) {
      setSubmitError("Password must be at least 6 characters long");
    } else if ((name === "checkPsw" || name === "password") && User.checkPsw === User.password) {
      // ! This is strange logic, now I don't knwo and I'm not going to go deeper with this.
      setSubmitError("Passwords doesn't match!");
    } else if (name === "tonWallet" && !/^EQ[A-Za-z0-9_-]{47}$|^[A-Za-z0-9_-]{48}$/.test(value)) {
      setSubmitError("Invalid TON wallet address");
    } else {
      setSubmitError("");
    }


  };

  const supabase = createClient();

  async function registerNewUser(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      const { data: successSignUp, error } = await supabase.auth.signUp({
        email: User!.email,
        password: User!.password,
        options: {
          emailRedirectTo: `${location.origin}/auth/success`,
        },
      });
      if (error) {
        toast.error("Something went wrong!")
        throw error
      };
      if (successSignUp) {
        toast.success("Please confirm your email, the message was sent!");
        const user = await supabase.auth.getSession()
        console.log(user.data.session?.user.id);
        
        const { data, error } = await supabase.from("Creators").insert({
          user_id: user.data.session?.user?.id,
          email: User.email,
          balance: 0,
          ton_wallet: User.tonWallet,
        });
        if (error) throw error;
        if (data) {
          toast.success("Account created successfully!");
        }
      }
    } catch (err) {
      console.error("Error while sign up at registerNewUser func:", err);
      setSubmitError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-center justify-center p-6">
      <Toaster position="top-center" richColors />
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
          <h1 className="mt-4 text-2xl font-semibold text-white">
            Create account
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Join StarDrop to manage and sell your files
          </p>
        </header>

        <section className="relative bg-slate-800/60 backdrop-blur-md rounded-xl p-6 shadow-md">
          <form className="space-y-4" onSubmit={(e) => registerNewUser(e)}>
            <label className="block">
              <span className="text-sm text-slate-300">Ton wallet</span>
              <input
                className="mt-2 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2"
                placeholder="your ton wallet"
                aria-label="Ton_wallet"
                value={User!.tonWallet}
                name="tonWallet"
                onChange={(e) => handleInput(e)}
                required
              />
            </label>
            <label className="block">
              <span className="text-sm text-slate-300">Email</span>
              <input
                className="mt-2 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2"
                placeholder="you@example.com"
                aria-label="Email"
                value={User!.email}
                name="email"
                onChange={(e) => handleInput(e)}
                required
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block col-span-2">
                <span className="text-sm text-slate-300">Password</span>
                <input
                  type="password"
                  className="mt-2 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2"
                  placeholder="••••••••"
                  aria-label="Password"
                  name="password"
                  onChange={(e) => handleInput(e)}
                  required
                />
              </label>

              <label className="block col-span-2">
                <span className="text-sm text-slate-300">Confirm Password</span>
                <input
                  type="password"
                  className="mt-2 w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2"
                  placeholder="••••••••"
                  aria-label="Confirm Password"
                  name="checkPsw"
                  onChange={(e) => handleInput(e)}
                  required
                />
                {submitError ? (
                  <h1 className=" pt-1 text-2md  text-red-500">{submitError}</h1>
                ) : (
                  ""
                )}
              </label>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-full text-white font-medium"
              style={submitError == "" ? { backgroundColor: "#169fda" } : { backgroundColor: "#2b2b2bff" }}
              disabled={submitError == "" ? false : true}
            >
              {Loading ? "Creating account . . ." : "Create account"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <a
              className="text-sm text-slate-400 hover:text-white"
              href="/auth/login"
            >
              Already have an account? Sign in
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
