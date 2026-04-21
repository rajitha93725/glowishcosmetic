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
  searchParams: { tag?: string; search?: string };
}) {
  const allProducts = await getProducts();
  const tag = searchParams.tag?.toLowerCase();
  const search = searchParams.search?.toLowerCase();

  const filtered = allProducts.filter((p) => {
    const matchesTag = !tag || p.tags?.some((t) => t.toLowerCase() === tag);
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search) ||
      p.code?.toLowerCase().includes(search) ||
      p.tags?.some((t) => t.toLowerCase().includes(search));
    return matchesTag && matchesSearch;
  });

  const allTags = Array.from(new Set(allProducts.flatMap((p) => p.tags ?? [])));

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-pink-100 py-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="section-title">Our Products</h1>
          <p className="section-subtitle mb-0">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <ShopFilters tags={allTags} activeTag={tag} />

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-24 text-pink-300">
            <p className="text-5xl mb-4">🌸</p>
            <p className="text-xl font-display">No products found</p>
            <p className="text-sm mt-2">Try a different filter or search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
