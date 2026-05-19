"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await login(email, password);

    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "Login failed.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="relative flex min-h-screen w-full bg-black text-white selection:bg-[#CCFF00] selection:text-black">
      {/* Left Visual Panel */}
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden lg:flex">
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/20 via-black/10 to-black" />
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-image.png"
            alt="Premium Vape Technology"
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>

        {/* Decorative glow */}
        <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-64 w-full bg-gradient-to-t from-black to-transparent" />

        {/* Brand Overlay Text */}
        <div className="relative z-20 max-w-md px-12 pb-32 self-end">
          <p className="mb-3 text-[10px] font-black tracking-[5px] text-[#CCFF00] uppercase">
            Evolve The Flow.
          </p>
          <p className="text-sm leading-relaxed text-zinc-300">
            Join the next generation of vapor technology. Premium builds, uncompromising flavor, and an elite community await.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-16 lg:w-1/2 lg:px-20">
        <div className="w-full max-w-md animate-fadeIn">
          {/* Secure Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#CCFF00]/20 bg-[#CCFF00]/5 px-4 py-1.5">
            <ShieldCheck size={12} className="text-[#CCFF00]" />
            <span className="text-[9px] font-black tracking-[3px] text-[#CCFF00] uppercase">
              Secure Access
            </span>
          </div>

          {/* Header */}
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Welcome Back
          </h2>
          <p className="mt-2 text-xs text-zinc-400">
            Enter your credentials to access your account.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs font-bold text-red-400">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-[9px] font-black tracking-[3px] text-white/40 uppercase">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  <Mail size={15} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/5 bg-[#0D0D0D] py-3.5 pr-4 pl-11 text-xs text-white placeholder-white/20 transition-all duration-300 focus:border-[#CCFF00]/40 focus:ring-1 focus:ring-[#CCFF00]/20 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[9px] font-black tracking-[3px] text-white/40 uppercase">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[9px] font-black tracking-widest text-[#CCFF00] uppercase hover:text-[#b3e600] transition-colors"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  <Lock size={15} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/5 bg-[#0D0D0D] py-3.5 pr-12 pl-11 text-xs text-white placeholder-white/20 transition-all duration-300 focus:border-[#CCFF00]/40 focus:ring-1 focus:ring-[#CCFF00]/20 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <label className="flex cursor-pointer items-center gap-3">
              <div
                onClick={() => setRememberMe(!rememberMe)}
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-200 ${
                  rememberMe
                    ? "border-[#CCFF00] bg-[#CCFF00]"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {rememberMe && (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                  >
                    <path
                      d="M2 5L4 7L8 3"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="text-[11px] text-zinc-400">
                Stay logged in for 30 days
              </span>
            </label>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#CCFF00] py-4 text-xs font-black tracking-widest text-black uppercase transition-all duration-300 hover:bg-[#b3e600] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Separator */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[9px] font-black tracking-[3px] text-white/20 uppercase">
              New Here?
            </span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          {/* Create Account Link */}
          <p className="text-center text-xs text-zinc-400">
            New to the flux?{" "}
            <Link
              href="/register"
              className="font-black text-white hover:text-[#CCFF00] transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
