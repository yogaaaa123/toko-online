import { Product } from '@/types';
import { getLocalProducts } from './productStore';

export async function fetchMergedProducts(): Promise<Product[]> {
  try {
    // 1. Fetch from External API
    const response = await fetch('https://api.escuelajs.co/api/v1/products?limit=50', {
      next: { revalidate: 60 }, // Revalidate every 60s
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from external API');
    }

    const apiProducts: Product[] = await response.json();

    // 2. Get Local Products
    const localProducts = getLocalProducts();

    // 3. Merge and Sort
    // Gabung lalu sort berdasarkan ID descending (terbaru paling atas)
    const combined = [...localProducts, ...apiProducts];
    return combined.sort((a, b) => b.id - a.id);
  } catch (error) {
    console.error('Error in fetchMergedProducts:', error);
    // Fallback to just local products if API fails
    return getLocalProducts();
  }
}
