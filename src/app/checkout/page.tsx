"use client";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const [form, setForm] = useState({ customerName: "", phone: "", address: "", notes: "" });
  const [loading, setLoading] = useState(false);

  const total = items.reduce((sum, i) => sum + (i.product.price ?? 0) * i.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("Your cart is empty!"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, productIds: items.map((i) => i.product.id) }),
      });

      if (!res.ok) throw new Error("Order failed");

      clearCart();
      toast.success("Order placed successfully! We'll contact you soon.");
      router.push("/");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form, label: string, type = "text", placeholder = "") => (
    <div key={key}>
      <label className="text-sm text-gray-600 font-medium block mb-1">{label}</label>
      {key === "notes" ? (
        <textarea
          rows={3}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="w-full border border-pink-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
          placeholder={placeholder}
        />
      ) : (
        <input
          required={key !== "notes"}
          type={type}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="w-full border border-pink-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          placeholder={placeholder}
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-pink-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="section-title mb-2">Checkout</h1>
        <p className="section-subtitle">Fill in your details to place your order</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-display text-xl font-bold text-pink-700">Your Details</h2>
            {field("customerName", "Full Name", "text", "Jane Doe")}
            {field("phone", "Phone Number", "tel", "+1 (555) 000-0000")}
            {field("address", "Delivery Address", "text", "123 Main St, City, Country")}
            {field("notes", "Order Notes (optional)", "text", "Any special requests?")}

            <button type="submit" disabled={loading || items.length === 0} className="btn-primary w-full mt-2">
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
            <h2 className="font-display text-xl font-bold text-pink-700 mb-4">Order Summary</h2>

            {items.length === 0 ? (
              <p className="text-gray-400 text-sm">No items in cart</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-pink-50 flex-shrink-0">
                        {product.image ? (
                          <Image src={product.image.url} alt={product.name} fill className="object-cover" sizes="48px" />
                        ) : (
                          <span className="flex items-center justify-center h-full text-xl">🌸</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                        <p className="text-xs text-pink-400">Qty: {quantity}</p>
                      </div>
                      {product.price && (
                        <p className="text-sm font-bold text-pink-600">
                          ${(product.price * quantity).toFixed(2)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-t border-pink-100 pt-3">
                  <div className="flex justify-between font-bold text-pink-700">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
