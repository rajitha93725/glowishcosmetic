"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";

export function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (status === "loading") {
    return <div className="w-8 h-8 rounded-full bg-pink-100 animate-pulse" />;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/login"
          className="text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors hidden sm:block">
          Sign In
        </Link>
        <Link href="/auth/register"
          className="text-sm font-bold bg-pink-500 text-white px-3 py-1.5 rounded-full hover:bg-pink-600 transition-colors">
          Join Free
        </Link>
      </div>
    );
  }

  const initials = session.user.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "U";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 group"
        aria-label="User menu"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
          {initials}
        </div>
        <span className="text-sm font-semibold text-pink-700 hidden sm:block max-w-[100px] truncate">
          {session.user.name?.split(" ")[0]}
        </span>
        <FiChevronDown className={`text-pink-400 text-xs hidden sm:block transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-pink-100 py-2 z-50 animate-fade-in">
          {/* User info */}
          <div className="px-4 py-3 border-b border-pink-50">
            <p className="text-sm font-semibold text-pink-800 truncate">{session.user.name}</p>
            <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
            <span className="inline-flex items-center gap-1 mt-1.5 text-xs bg-pink-100 text-pink-600 font-semibold px-2 py-0.5 rounded-full">
              ✦ Member — 5% off
            </span>
          </div>

          {/* Actions */}
          <div className="py-1">
            <Link href="/shop" onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors">
              <FiUser className="text-pink-300" /> Shop Products
            </Link>
            <button
              onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors"
            >
              <FiLogOut className="text-pink-300" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
