import { hygraphClient } from "@/lib/hygraph";
import { GET_PRODUCT_BY_ID, GET_ALL_PRODUCTS } from "@/lib/queries";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import type { Product } from "@/types";
import { lkr, usdLabel } from "@/lib/currency";

export async function generateStaticParams() {
  try {
    const data = await hygraphClient.request<{ products: { id: string }[] }>(GET_ALL_PRODUCTS);
    return data.products.map((p) => ({ id: p.id }));
  } catch {
    return [];
  }
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const data = await hygraphClient.request<{ product: Product }>(GET_PRODUCT_BY_ID, { id });
    return data.product ?? null;
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) return notFound();

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-none border border-[#333333]/10 shadow-sm overflow-hidden grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative h-72 md:h-auto bg-gray-50 min-h-[320px]">
            {product.image ? (
              <Image
                src={product.image.url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">🌸</div>
            )}
          </div>

          {/* Details */}
          <div className="p-8 flex flex-col justify-center">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags?.map((tag) => (
                <span key={tag} className="tag-badge">{tag}</span>
              ))}
            </div>

            <p className="text-xs text-gray-400 font-mono mb-1">{product.code}</p>
            <h1 className="font-display text-3xl font-normal tracking-wide text-[#333333] mb-4">{product.name}</h1>

            {product.price != null && (
              <div className="mb-4">
                <p className="text-2xl font-medium tracking-wide text-[#333333]">{lkr(product.price)}</p>
                <p className="text-sm text-gray-400 mt-0.5">{usdLabel(product.price)} USD</p>
              </div>
            )}

            {product.description?.html && (
              <div
                className="text-gray-600 font-light tracking-wide text-sm leading-relaxed mb-6 prose prose-stone max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description.html }}
              />
            )}

            <div className="flex gap-3">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
