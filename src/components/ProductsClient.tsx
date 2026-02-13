'use client';

import { useEffect, useState, Suspense } from 'react';
import ProductCard from '@/components/ProductCard';
import BannerCarousel from '@/components/BannerCarousel';
import Loader from '@/components/Loader';
import { Product } from '@/types';
import { useSearchParams } from 'next/navigation';

interface ProductsClientProps {
  initialData: Product[];
}

const CACHE_KEY = 'products_cache';


interface CacheData {
  data: Product[];
  timestamp: number;
}

function ProductsContent({ initialData }: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialData);
  const [loading, setLoading] = useState(false);
  
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  useEffect(() => {
    const query = searchParams.get('search');
    if (query !== null) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  useEffect(() => {
    setProducts(initialData);
    setCacheData(initialData);

    const intervalId = setInterval(() => {
      fetchFreshData();
    }, 30000); 

    return () => clearInterval(intervalId);
  }, [initialData]);

  // Fungsi untuk ambil data fresh dari API (CSR)
  const fetchFreshData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
      setCacheData(data);
    } catch (error) {
      console.error(' Gagal fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BannerCarousel />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Produk Kami
          </h2>
        </div>


        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            Tidak ada produk yang cocok dengan pencarian &quot;{searchTerm}&quot;
          </p>
        )}
      </div>
    </div>
  );
}

export default function ProductsClient({ initialData }: ProductsClientProps) {
  return (
    <Suspense fallback={<Loader />}>
      <ProductsContent initialData={initialData} />
    </Suspense>
  );
}


function setCacheData(data: Product[]): void {
  if (typeof window === 'undefined') return;

  try {
    const cacheData: CacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
}
