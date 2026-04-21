"use client";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import Image from "next/image";
import { FiX, FiTrash2, FiShoppingBag } from "react-icons/fi";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: Props) {
  const { items, removeItem } = useCartStore();

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-pink-100">
          <h2 className="font-display text-xl font-bold text-pink-700 flex items-center gap-2">
            <FiShoppingBag /> Your Cart
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-pink-50 rounded-full text-gray-500">
            <FiX />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <FiShoppingBag className="text-5xl mx-auto mb-3 text-pink-200" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-3 items-center bg-pink-50 rounded-xl p-3">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white flex-shrink-0">
                  {product.image ? (
                    <Image src={product.image.url} alt={product.name} fill className="object-cover" sizes="56px" />
                  ) : (
                    <span className="text-2xl flex items-center justify-center h-full">🌸</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">{product.name}</p>
                  <p className="text-xs text-pink-400">Qty: {quantity}</p>
                  {product.price && (
                    <p className="text-sm font-bold text-pink-600">${(product.price * quantity).toFixed(2)}</p>
                  )}
                </div>
                <button
                  onClick={() => removeItem(product.id)}
                  className="text-pink-300 hover:text-pink-500 p-1"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-pink-100">
            <Link href="/checkout" onClick={onClose} className="btn-primary w-full text-center block">
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
