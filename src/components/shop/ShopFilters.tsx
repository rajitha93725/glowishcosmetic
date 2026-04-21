"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface Props {
  tags: string[];
  activeTag?: string;
}

export function ShopFilters({ tags, activeTag }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setTag = useCallback(
    (tag: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tag) params.set("tag", tag);
      else params.delete("tag");
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
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* Search */}
      <input
        type="search"
        placeholder="Search products..."
        defaultValue={searchParams.get("search") ?? ""}
        onChange={handleSearch}
        className="border border-pink-200 rounded-full px-5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white w-full sm:w-64"
      />

      {/* Tag filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTag(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !activeTag ? "bg-pink-500 text-white" : "bg-white text-pink-500 border border-pink-200 hover:bg-pink-50"
          }`}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setTag(tag)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTag === tag.toLowerCase()
                ? "bg-pink-500 text-white"
                : "bg-white text-pink-500 border border-pink-200 hover:bg-pink-50"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
