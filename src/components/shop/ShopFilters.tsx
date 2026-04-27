"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const CATEGORIES = [
  { apiId: "SkinCare",  label: "Skin Care",  emoji: "✨" },
  { apiId: "Fragrance", label: "Fragrance",  emoji: "🌺" },
  { apiId: "Hair",      label: "Hair",       emoji: "💆" },
  { apiId: "Makeup",    label: "Makeup",     emoji: "💄" },
];

interface Props {
  activeCategory?: string;
}

export function ShopFilters({ activeCategory }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setCategory = useCallback(
    (cat: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("search");
      if (cat) params.set("category", cat);
      else params.delete("category");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const params = new URLSearchParams(searchParams.toString());
      if (e.target.value) params.set("search", e.target.value);
      else params.delete("search");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="space-y-4">
      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !activeCategory
              ? "bg-pink-500 text-white shadow-sm"
              : "bg-white text-pink-500 border border-pink-200 hover:bg-pink-50"
          }`}
        >
          All Products
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.apiId}
            onClick={() => setCategory(cat.apiId)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeCategory === cat.apiId
                ? "bg-pink-500 text-white shadow-sm"
                : "bg-white text-pink-500 border border-pink-200 hover:bg-pink-50"
            }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="search"
        placeholder="Search products..."
        defaultValue={searchParams.get("search") ?? ""}
        onChange={handleSearch}
        className="border border-pink-200 rounded-full px-5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white w-full sm:w-72"
      />
    </div>
  );
}
