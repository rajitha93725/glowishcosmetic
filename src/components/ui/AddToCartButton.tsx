"use client";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import { FiShoppingCart } from "react-icons/fi";
import type { Product } from "@/types";

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <button
      onClick={() => { addItem(product); toast.success(`${product.name} added to cart!`); }}
      className="btn-primary flex items-center gap-2"
    >
      <FiShoppingCart />
      Add to Cart
    </button>
  );
}
