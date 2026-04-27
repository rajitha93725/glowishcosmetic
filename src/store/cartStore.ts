"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, qty = 1) => {
        const existing = get().items.find((i) => i.product.id === product.id);
        if (existing) {
          set((s) => ({
            items: s.items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + qty }
                : i
            ),
          }));
        } else {
          set((s) => ({ items: [...s.items, { product, quantity: qty }] }));
        }
      },

      removeItem: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.product.id !== productId) })),

      updateQuantity: (productId, qty) => {
        if (qty <= 0) {
          set((s) => ({ items: s.items.filter((i) => i.product.id !== productId) }));
        } else {
          set((s) => ({
            items: s.items.map((i) =>
              i.product.id === productId ? { ...i, quantity: qty } : i
            ),
          }));
        }
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "glowish-cart" }
  )
);
