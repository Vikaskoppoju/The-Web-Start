"use client";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { m } from "framer-motion";
import { Zap, Eye, EyeOff, UserPlus, CheckCircle } from "lucide-react";
import Link from "next/link";
import { GradientText } from "@/components/ui/GradientText";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [done, setDone]       = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if ((data.password as string).length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false); return;
    }
    try {
      const res  = await fetch("/api/portal/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setDone(true);
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        setError(json.error ?? "Registration failed");
      }
    } catch { setError("Network error. Try again."); }
    finally { setLoading(false); }
  };

  if (done) {
    return (
      <div className="glass-strong rounded-2xl p-8 border border-white/10 text-center">
        <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
        <h2 className="font-display font-bold text-white text-xl mb-1">Account Created!</h2>
        <p className="text-gray-400 text-sm">Redirecting to your dashboard…</p>
      </div>
    );
  }

  return (
    <div className="glass-strong rounded-2xl p-8 border border-white/10">
      <h1 className="font-display font-bold text-white text-2xl mb-1 text-center">Create Account</h1>
      <p className="text-gray-500 text-sm text-center mb-7">Sign up to access your client portal</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name"    type="text"  label="Full Name"    placeholder="John Smith"          required autoComplete="name" />
        <Input name="email"   type="email" label="Email"        placeholder="you@company.com"     required autoComplete="email" />
        <Input name="company" type="text"  label="Company"      placeholder="Acme Inc. (optional)" />
        <Input name="phone"   type="tel"   label="Phone"        placeholder="+91 98765 43210 (optional)" />
        <div className="relative">
          <Input name="password" type={showPw ? "text" : "password"} label="Password"
            placeholder="Min 8 characters" required autoComplete="new-password" />
          <button type="button"
            className="absolute right-3 bottom-3 text-gray-500 hover:text-gray-300 transition-colors"
            onClick={() => setShowPw(v => !v)}>
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {error && (
          <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>
        )}

        <Button type="submit" loading={loading} className="w-full justify-center mt-2"
          icon={<UserPlus className="w-4 h-4" />}>
          Create Account
        </Button>
      </form>

      <p className="text-center text-gray-500 text-sm mt-5">
        Already have an account?{" "}
        <Link href="/portal/login" className="text-purple-400 hover:text-purple-300 transition-colors">Sign in</Link>
      </p>
    </div>
  );
}

export default function PortalRegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#04040a]">
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <m.div className="w-full max-w-sm" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white">Client <GradientText>Portal</GradientText></span>
        </div>
        <Suspense fallback={<div className="glass-strong rounded-2xl p-8 border border-white/10 h-96 animate-pulse" />}>
          <RegisterForm />
        </Suspense>
        <p className="text-center text-gray-700 text-xs mt-4">
          <Link href="/" className="hover:text-gray-500 transition-colors">← Back to website</Link>
        </p>
      </m.div>
    </div>
  );
}
