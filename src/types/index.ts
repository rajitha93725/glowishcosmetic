export interface ProductImage {
  url: string;
  width?: number;
  height?: number;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  description?: { html: string };
  tags: string[];
  price?: number;
  image?: ProductImage;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderInput {
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  productIds: string[];
}

export interface WebsiteSettings {
  title: string;
  aboutContent?: { html: string };
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  headerImage?: { url: string };
}
