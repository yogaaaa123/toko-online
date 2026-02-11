import { Product } from '@/types';

let localProducts: Product[] = [];

export function getLocalProducts(): Product[] {
  return localProducts;
}

export function addLocalProduct(product: Product): void {
  localProducts.unshift(product);
}

export function updateLocalProduct(id: number, updates: Partial<Product>): Product | null {
  const index = localProducts.findIndex(p => p.id === id);
  if (index !== -1) {
    localProducts[index] = { ...localProducts[index], ...updates };
    return localProducts[index];
  }
  return null;
}

export function removeLocalProduct(id: number): boolean {
  const initialLength = localProducts.length;
  localProducts = localProducts.filter(p => p.id !== id);
  return localProducts.length < initialLength;
}
