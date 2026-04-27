"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { lkr, usdLabel } from "@/lib/currency";

const MEMBER_DISCOUNT = 0.05;

const COUNTRY_CODES = [
  { code: "+94", label: "🇱🇰 +94" },
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+1",  label: "🇺🇸 +1"  },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+61", label: "🇦🇺 +61" },
  { code: "+971",label: "🇦🇪 +971"},
  { code: "+65", label: "🇸🇬 +65" },
  { code: "+60", label: "🇲🇾 +60" },
];

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const [form, setForm] = useState({ customerName: "", phone: "", address: "", notes: "" });
  const [phoneCode, setPhoneCode] = useState("+94");
  const [loading, setLoading] = useState(false);

  // Pre-fill from session when it loads
  useEffect(() => {
    if (session?.user) {
      const mobile = session.user.mobile ?? "";
      const match = mobile.match(/^(\+\d{1,3})\s*(.*)$/);
      setForm((f) => ({
        ...f,
        customerName: session.user.name ?? f.customerName,
        phone: match ? match[2] : mobile,
      }));
      if (match) setPhoneCode(match[1]);
    }
  }, [session]);

  const subtotal = items.reduce((sum, i) => sum + (i.product.price ?? 0) * i.quantity, 0);
  const discountAmount = session ? subtotal * MEMBER_DISCOUNT : 0;
  const total = subtotal - discountAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("Your cart is empty!"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          phone: `${phoneCode} ${form.phone}`,
          productIds: items.map((i) => i.product.id),
          customerEmail: session?.user?.email ?? undefined,
          discountApplied: discountAmount > 0 ? MEMBER_DISCOUNT * 100 : undefined,
        }),
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

  const inputCls = "w-full border border-pink-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300";

  return (
    <div className="min-h-screen bg-pink-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="section-title mb-2">Checkout</h1>
        <p className="section-subtitle">Fill in your details to place your order</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-display text-xl font-bold text-pink-700">
              Your Details
              {session && <span className="ml-2 text-xs font-normal text-pink-400">(pre-filled from your account)</span>}
            </h2>

            {/* Full Name */}
            <div>
              <label className="text-sm text-gray-600 font-medium block mb-1">Full Name</label>
              <input
                required
                type="text"
                placeholder="Jane Doe"
                value={form.customerName}
                onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                className={inputCls}
              />
            </div>

            {/* Phone with country code */}
            <div>
              <label className="text-sm text-gray-600 font-medium block mb-1">Phone Number</label>
              <div className="flex">
                <select
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                  className="border border-pink-200 border-r-0 rounded-l-xl px-2 py-2.5 text-sm bg-pink-50 text-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-300 flex-shrink-0"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
                <input
                  required
                  type="tel"
                  placeholder="71 601 2640"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="flex-1 border border-pink-200 rounded-r-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 min-w-0"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="text-sm text-gray-600 font-medium block mb-1">Delivery Address</label>
              <input
                required
                type="text"
                placeholder="123 Main St, City, Country"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className={inputCls}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm text-gray-600 font-medium block mb-1">Order Notes (optional)</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="w-full border border-pink-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
                placeholder="Any special requests?"
              />
            </div>

            <button type="submit" disabled={loading || items.length === 0} className="btn-primary w-full mt-2">
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Guest discount banner */}
            {!session && (
              <div className="bg-pink-50 border border-pink-200 rounded-2xl px-4 py-3 flex items-center gap-3">
                <span className="text-2xl">🎁</span>
                <p className="text-sm text-pink-700">
                  <Link href="/auth/login" className="font-bold underline hover:text-pink-900">Sign in</Link>{" "}
                  to get <span className="font-bold">5% off</span> your order
                </p>
              </div>
            )}

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
                            {lkr(product.price * quantity)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-pink-100 pt-3 space-y-1.5">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal</span>
                      <span>{lkr(subtotal)}</span>
                    </div>
                    {session && discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600 font-medium">
                        <span>✦ Member discount (5%)</span>
                        <span>−{lkr(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-pink-700 text-base pt-1 border-t border-pink-50">
                      <span>Total</span>
                      <div className="text-right">
                        <p>{lkr(total)}</p>
                        <p className="text-xs text-gray-400 font-normal">{usdLabel(total)} USD</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
