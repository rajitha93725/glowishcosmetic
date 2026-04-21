"use client";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import type { Product } from "@/types";

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

  return (
    <div className="card group animate-fade-in">
      {/* Image */}
      <Link href={`/shop/${product.id}`} className="block relative h-56 bg-pink-50 overflow-hidden">
        {product.image ? (
          <Image
            src={product.image.url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            <span>🌸</span>
          </div>
        )}
        {/* Tag overlay */}
        {product.tags?.length > 0 && (
          <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
            {product.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="tag-badge">{tag}</span>
            ))}
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-pink-300 font-mono mb-1">{product.code}</p>
        <Link href={`/shop/${product.id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-pink-600 transition-colors leading-snug mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-3">
          {product.price != null ? (
            <span className="font-bold text-pink-600 text-lg">${product.price.toFixed(2)}</span>
          ) : (
            <span className="text-pink-300 text-sm italic">Price on request</span>
          )}

          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 btn-primary !px-4 !py-2 text-sm"
          >
            <FiShoppingCart className="text-base" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
