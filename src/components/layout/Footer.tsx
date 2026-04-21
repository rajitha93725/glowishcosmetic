import Link from "next/link";
import { GiFlowerEmblem } from "react-icons/gi";
import { FiInstagram, FiFacebook, FiTwitter } from "react-icons/fi";

export function Footer() {
  return (
    <footer className="bg-white border-t border-pink-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <GiFlowerEmblem className="text-pink-400 text-2xl" />
            <span className="font-display font-bold text-xl text-pink-600">Glowish</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Premium cosmetics crafted with love. Beauty that blooms with every use.
          </p>
          <div className="flex gap-4 mt-4">
            {[FiInstagram, FiFacebook, FiTwitter].map((Icon, i) => (
              <a key={i} href="#" className="text-pink-400 hover:text-pink-600 transition-colors">
                <Icon className="text-xl" />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-semibold text-pink-700 mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            {[["Home", "/"], ["Shop", "/shop"], ["About Us", "/about"], ["Contact", "/contact"]].map(([l, h]) => (
              <li key={h}>
                <Link href={h} className="hover:text-pink-500 transition-colors">{l}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-pink-700 mb-3">Get in Touch</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>info@glowishcosmetics.com</li>
            <li>+1 (555) 123-4567</li>
            <li>123 Beauty Lane, Bloom City</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-pink-50 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Glowish Cosmetics. All rights reserved.
      </div>
    </footer>
  );
}
