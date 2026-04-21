import { hygraphClient } from "@/lib/hygraph";
import { GET_ALL_PRODUCTS } from "@/lib/queries";
import { HeroSection } from "@/components/home/HeroSection";
import { MarqueeStrip } from "@/components/home/MarqueeStrip";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CtaBanner } from "@/components/home/CtaBanner";
import type { Product } from "@/types";

async function getProducts(): Promise<Product[]> {
  try {
    const data = await hygraphClient.request<{ products: Product[] }>(GET_ALL_PRODUCTS);
    return data.products;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.slice(0, 6);

  return (
    <>
      <HeroSection />
      <MarqueeStrip />
      <CategorySection />
      <FeaturedProducts products={featured} />
      <MarqueeStrip dark />
      <TestimonialsSection />
      <CtaBanner />
    </>
  );
}
