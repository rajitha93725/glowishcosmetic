"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GiFlowerEmblem } from "react-icons/gi";
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

const COUNTRY_CODES = [
  { code: "+94", label: "🇱🇰 +94" },
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+1",  label: "🇺🇸 +1"  },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+61", label: "🇦🇺 +61" },
  { code: "+971",label: "🇦🇪 +971"},
  { code: "+65", label: "🇸🇬 +65" },
  { code: "+60", label: "🇲🇾 +60" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "" });
  const [mobileCode, setMobileCode] = useState("+94");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, mobile: `${mobileCode} ${form.mobile}` }),
      });
      const data = await res.json();

      if (!res.ok) { toast.error(data.error ?? "Registration failed"); setLoading(false); return; }

      // Auto sign-in after registration
      const signInRes = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      setLoading(false);
      if (signInRes?.ok) {
        toast.success("Account created! Welcome to Glowish 🌸");
        router.push("/");
        router.refresh();
      } else {
        toast.success("Account created! Please sign in.");
        router.push("/auth/login");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
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
          <h1 className="font-display text-3xl font-bold text-pink-900 mb-1">Create account</h1>
          <p className="text-gray-500 text-sm">Just your name, email & mobile — that's it ✨</p>
        </div>

        {/* Perks banner */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-400 rounded-2xl p-4 mb-6 text-white">
          <p className="font-bold text-sm mb-1">✦ Member benefits</p>
          <ul className="text-xs text-pink-100 space-y-0.5">
            <li>🎁 5% discount on every order</li>
            <li>📦 Early access to new arrivals</li>
            <li>💌 Exclusive member offers</li>
          </ul>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-pink-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-300" />
                <input required type="text" placeholder="Jane Doe" value={form.name} onChange={set("name")}
                  className="w-full border border-pink-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-300" />
                <input required type="email" placeholder="you@example.com" value={form.email} onChange={set("email")}
                  className="w-full border border-pink-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
              </div>
            </div>

            {/* Mobile */}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Mobile number</label>
              <div className="flex">
                <select
                  value={mobileCode}
                  onChange={(e) => setMobileCode(e.target.value)}
                  className="border border-pink-200 border-r-0 rounded-l-xl px-2 py-2.5 text-sm bg-pink-50 text-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-300 flex-shrink-0"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-300" />
                  <input required type="tel" placeholder="71 601 2640" value={form.mobile} onChange={set("mobile")}
                    className="w-full border border-pink-200 rounded-r-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-300" />
                <input required type={showPw ? "text" : "password"} placeholder="Min. 6 characters" value={form.password} onChange={set("password")}
                  className="w-full border border-pink-200 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-pink-300 hover:text-pink-500">
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-60">
              {loading ? "Creating account..." : "Create Account — It's Free"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-pink-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-sm text-gray-400 mt-4">
          <Link href="/checkout" className="hover:text-pink-400 transition-colors">
            Continue as guest →
          </Link>
        </p>
      </div>
    </div>
  );
}
