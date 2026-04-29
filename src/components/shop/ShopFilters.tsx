"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { FiDroplet, FiStar, FiWind, FiFeather } from "react-icons/fi";
import type { Brand } from "@/types";

const CATEGORIES = [
  { apiId: "SkinCare",  label: "Skin Care",  icon: FiDroplet },
  { apiId: "Fragrance", label: "Fragrance",  icon: FiWind },
  { apiId: "Hair",      label: "Hair",       icon: FiFeather },
  { apiId: "Makeup",    label: "Makeup",     icon: FiStar },
];

interface Props {
  activeCategory?: string;
  activeBrand?: string;
  brands?: Brand[];
}

export function ShopFilters({ activeCategory, activeBrand, brands = [] }: Props) {
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

  const setBrand = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const brand = e.target.value;
      const params = new URLSearchParams(searchParams.toString());
      if (brand) params.set("brand", brand);
      else params.delete("brand");
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
          className={`px-4 py-2 rounded-none text-sm font-normal tracking-wide transition-colors ${
            !activeCategory
              ? "bg-[#333333] text-white shadow-sm"
              : "bg-white text-[#333333] border border-[#333333]/20 hover:bg-gray-50"
          }`}
        >
          All Products
        </button>
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.apiId}
              onClick={() => setCategory(cat.apiId)}
              className={`px-4 py-2 rounded-none text-sm font-normal tracking-wide transition-colors flex items-center gap-1.5 ${
                activeCategory === cat.apiId
                  ? "bg-[#333333] text-white shadow-sm"
                  : "bg-white text-[#333333] border border-[#333333]/20 hover:bg-gray-50"
              }`}
            >
              <Icon className="text-base" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Search and Brand */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="search"
          placeholder="Search products..."
          defaultValue={searchParams.get("search") ?? ""}
          onChange={handleSearch}
          className="border border-[#333333]/20 rounded-none px-5 py-2 text-sm font-normal focus:outline-none focus:border-[#333333] bg-white w-full sm:w-72"
        />

        <select
          value={activeBrand || ""}
          onChange={setBrand}
          className="border border-[#333333]/20 rounded-none px-5 py-2 text-sm font-normal focus:outline-none focus:border-[#333333] bg-white w-full sm:w-60 appearance-none bg-no-repeat bg-right"
          style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.slug || b.name}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
