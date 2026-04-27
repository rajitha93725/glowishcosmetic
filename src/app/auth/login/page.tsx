"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GiFlowerEmblem } from "react-icons/gi";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);

    if (res?.ok) {
      toast.success("Welcome back! 🌸");
      router.push("/");
      router.refresh();
    } else {
      toast.error("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fff0f5] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <GiFlowerEmblem className="text-pink-400 text-3xl" />
            <span className="font-display font-bold text-2xl text-pink-600">Glowish</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-pink-900 mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm">Sign in to access your member discounts ✨</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-pink-100 p-8">
          {/* Discount callout */}
          <div className="bg-pink-50 border border-pink-200 rounded-2xl px-4 py-3 mb-6 flex flex-col items-center gap-1 text-center">
            <span className="text-2xl">🎁</span>
            <p className="text-sm text-pink-700 font-medium">
              All the Registered Members enjoy <span className="font-bold">5% off</span> for every orders
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-300 text-base" />
                <input
                  required
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full border border-pink-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-300 text-base" />
                <input
                  required
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full border border-pink-200 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-pink-300 hover:text-pink-500">
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-pink-600 font-semibold hover:underline">
              Create one free
            </Link>
          </p>
        </div>

        <p className="text-center text-sm text-gray-400 mt-4">
          <Link href="/shop" className="hover:text-pink-400 transition-colors">
            Continue browsing without account →
          </Link>
        </p>
      </div>
    </div>
  );
}
