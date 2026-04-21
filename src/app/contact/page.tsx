"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Message sent! We'll be in touch soon.");
    setForm({ name: "", email: "", message: "" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Hero */}
      <section className="bg-hero-gradient py-20 text-center">
        <h1 className="font-display text-5xl font-bold text-pink-800 mb-4">Contact Us</h1>
        <p className="text-pink-600 text-lg">We'd love to hear from you!</p>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12">
        {/* Info */}
        <div>
          <h2 className="font-display text-2xl font-bold text-pink-700 mb-6">Get in Touch</h2>
          <div className="space-y-5">
            {[
              { icon: FiMail, label: "Email", value: "info@glowishcosmetics.com" },
              { icon: FiPhone, label: "Phone", value: "+1 (555) 123-4567" },
              { icon: FiMapPin, label: "Address", value: "123 Beauty Lane, Bloom City, BC 12345" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="text-pink-500" />
                </div>
                <div>
                  <p className="font-semibold text-pink-700 text-sm">{label}</p>
                  <p className="text-gray-600 text-sm">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-display text-xl font-bold text-pink-700">Send a Message</h2>

          <div>
            <label className="text-sm text-gray-600 font-medium block mb-1">Your Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border border-pink-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium block mb-1">Email Address</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full border border-pink-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="jane@example.com"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium block mb-1">Message</label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="w-full border border-pink-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
              placeholder="How can we help you?"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}
