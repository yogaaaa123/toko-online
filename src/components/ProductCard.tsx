'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { Eye, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  let imageUrl = 'https://placehold.co/600x400';
  if (product.images && product.images.length > 0) {
      let img = product.images[0];
      if (img.startsWith('["') && img.endsWith('"]')) {
          try {
             const parsed = JSON.parse(img);
             if (Array.isArray(parsed) && parsed.length > 0) img = parsed[0];
             else if (typeof parsed === 'string') img = parsed;
          } catch {
             
          }
      }
      img = img.replace(/^["']|["']$/g, '');
      if (img.startsWith('http')) {
          imageUrl = img;
      }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    addToCart(product);
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <Link href={`/product/${product.id}`} className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 xl:aspect-h-8 xl:aspect-w-7 h-64 relative block">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>
      
      <div className="flex flex-1 flex-col p-4 space-y-2">
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 min-h-[2.5rem]">
          <Link href={`/product/${product.id}`} className="hover:text-violet-600 transition-colors">
            {product.title}
          </Link>
        </h3>
        <p className="text-sm text-gray-500 capitalize">{product.category.name}</p>
        
        <div className="flex flex-1 flex-col justify-end mt-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/product/${product.id}`}
              className="flex items-center justify-center bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-xs gap-1"
            >
              <Eye className="w-4 h-4" />
              Detail
            </Link>

            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center bg-violet-600 text-white py-2 px-3 rounded-lg hover:bg-violet-700 transition-colors font-medium text-xs gap-1"
            >
              <ShoppingCart className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
