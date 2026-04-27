import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/providers/Providers";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Glowish Cosmetics | Beauty That Blooms",
  description: "Discover premium cosmetics crafted for every skin type.",
  openGraph: {
    title: "Glowish Cosmetics",
    description: "Beauty That Blooms",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-pink-50">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#fff0f5",
                color: "#b3005f",
                border: "1px solid #ffc0cb",
                borderRadius: "12px",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
