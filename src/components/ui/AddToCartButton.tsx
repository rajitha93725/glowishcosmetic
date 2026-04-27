"use client";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import { FiShoppingCart, FiPlus, FiMinus } from "react-icons/fi";
import type { Product } from "@/types";

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    addItem(product, qty);
    toast.success(`${product.name} ×${qty} added to cart!`);
    setQty(1);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Qty stepper */}
      <div className="flex items-center border border-pink-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="px-3 py-2.5 text-pink-400 hover:bg-pink-50 transition-colors"
          aria-label="Decrease quantity"
        >
          <FiMinus />
        </button>
        <span className="px-4 text-base font-bold text-gray-700 min-w-[2.5rem] text-center">{qty}</span>
        <button
          onClick={() => setQty((q) => q + 1)}
          className="px-3 py-2.5 text-pink-400 hover:bg-pink-50 transition-colors"
          aria-label="Increase quantity"
        >
          <FiPlus />
        </button>
      </div>

      <button
        onClick={handleAdd}
        className="btn-primary flex items-center gap-2"
      >
        <FiShoppingCart />
        Add to Cart
      </button>
    </div>
  );
}
