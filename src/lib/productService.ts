import { Product } from '@/types';
import { getLocalProducts } from './productStore';

// Sanitize image URLs - replace dead/invalid URLs with working placeholder
function sanitizeImageUrls(images: string[]): string[] {
  const placeholder = 'https://placehold.co/600x400';
  const deadDomains = ['placeimg.com', 'picsum.photos'];
  
  return images
    .filter(url => {
      // Check if URL contains dead domains
      return !deadDomains.some(domain => url.includes(domain));
    })
    .map(url => {
      // Additional validation
      try {
        new URL(url);
        return url;
      } catch {
        return placeholder;
      }
    });
}

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
    
    // Sanitize image URLs from API products
    const sanitizedApiProducts = apiProducts.map(product => ({
      ...product,
      images: sanitizeImageUrls(product.images || []).length > 0 
        ? sanitizeImageUrls(product.images || [])
        : ['https://placehold.co/600x400']
    }));

    // 2. Get Local Products
    const localProducts = getLocalProducts();

    // 3. Merge and Sort
    // Gabung lalu sort berdasarkan ID descending (terbaru paling atas)
    const combined = [...localProducts, ...sanitizedApiProducts];
    return combined.sort((a, b) => b.id - a.id);
  } catch (error) {
    console.error('Error in fetchMergedProducts:', error);
    // Fallback to just local products if API fails
    return getLocalProducts();
  }
}
