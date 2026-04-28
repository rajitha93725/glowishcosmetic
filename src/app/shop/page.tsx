import { hygraphClient } from "@/lib/hygraph";
import { GET_ALL_PRODUCTS } from "@/lib/queries";
import { ProductCard } from "@/components/ui/ProductCard";
import { ShopFilters } from "@/components/shop/ShopFilters";
import type { Product } from "@/types";

async function getProducts(): Promise<Product[]> {
  try {
    const data = await hygraphClient.request<{ products: Product[] }>(GET_ALL_PRODUCTS);
    return data.products;
  } catch {
    return [];
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const allProducts = await getProducts();
  const category = searchParams.category;
  const search = searchParams.search?.toLowerCase();

  const filtered = allProducts.filter((p) => {
    const matchesCategory = !category || p.category === category;
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search) ||
      p.code?.toLowerCase().includes(search) ||
      p.tags?.some((t) => t.toLowerCase().includes(search));
    return matchesCategory && matchesSearch;
  });

  const CATEGORY_LABELS: Record<string, string> = {
    SkinCare: "Skin Care", Fragrance: "Fragrance", Hair: "Hair", Makeup: "Makeup",
  };
  const pageTitle = category ? CATEGORY_LABELS[category] ?? category : "Our Products";

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-[#333333]/10 py-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="section-title">{pageTitle}</h1>
          <p className="section-subtitle mb-0">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <ShopFilters activeCategory={category} />

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 mt-8">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-300">
            <p className="text-5xl mb-4">✨</p>
            <p className="text-xl font-display font-normal tracking-wide text-[#333333]">No products found</p>
            <p className="text-sm mt-2 text-gray-500 font-light">Try a different category or search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
