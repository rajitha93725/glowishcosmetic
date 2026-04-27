"use client";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import type { Product } from "@/types";

const CATEGORY_LABELS: Record<string, string> = {
  SkinCare: "Skin Care",
  Fragrance: "Fragrance",
  Hair: "Hair",
  Makeup: "Makeup",
};

const CATEGORY_COLORS: Record<string, string> = {
  SkinCare:  "bg-pink-100 text-pink-600",
  Fragrance: "bg-fuchsia-100 text-fuchsia-600",
  Hair:      "bg-purple-100 text-purple-600",
  Makeup:    "bg-rose-100 text-rose-600",
};

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  const categoryLabel = product.category ? CATEGORY_LABELS[product.category] ?? product.category : null;
  const categoryColor = product.category ? CATEGORY_COLORS[product.category] ?? "bg-pink-100 text-pink-600" : "";

  return (
    <div className="card group animate-fade-in">
      {/* Image */}
      <Link href={`/shop/${product.id}`} className="block relative h-48 sm:h-56 bg-pink-50 overflow-hidden">
        {product.image ? (
          <Image
            src={product.image.url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            <span>🌸</span>
          </div>
        )}
        {/* Category badge overlay */}
        {categoryLabel && (
          <div className="absolute top-2 left-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor}`}>
              {categoryLabel}
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <p className="text-xs text-pink-300 font-mono mb-1 truncate">{product.code}</p>
        <Link href={`/shop/${product.id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-pink-600 transition-colors leading-snug mb-2 line-clamp-2 text-sm sm:text-base">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-2 sm:mt-3">
          {product.price != null ? (
            <span className="font-bold text-pink-600 text-base sm:text-lg">${product.price.toFixed(2)}</span>
          ) : (
            <span className="text-pink-300 text-sm italic">On request</span>
          )}

          <button
            onClick={handleAdd}
            className="flex items-center gap-1 sm:gap-1.5 btn-primary !px-3 sm:!px-4 !py-1.5 sm:!py-2 text-xs sm:text-sm"
          >
            <FiShoppingCart className="text-sm sm:text-base" />
            <span className="hidden xs:inline sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
