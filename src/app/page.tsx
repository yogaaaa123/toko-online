import ProductsClient from '@/components/ProductsClient';
import { Product } from '@/types';

// Server-side function untuk fetch data
import { fetchMergedProducts } from '@/lib/productService';

// Server-side function untuk fetch data
async function fetchProducts(): Promise<Product[]> {
  return await fetchMergedProducts();
}

// Server Component (default di Next.js App Router)
export default async function Home() {
  // Data di-fetch di server (SSR)
  const initialProducts = await fetchProducts();

  // Pass initial data ke Client Component
  return <ProductsClient initialData={initialProducts} />;
}
