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

  // Sync state if URL changes
  useEffect(() => {
    const query = searchParams.get('search');
    if (query !== null) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  useEffect(() => {
    // Selalu gunakan data dari SSR sebagai source of truth saat pertama load
    setProducts(initialData);
    setCacheData(initialData); // Update cache dengan data terbaru dari server

    // Optional: Setup interval untuk auto-refresh
    const intervalId = setInterval(() => {
      // Refresh background
      fetchFreshData();
    }, 30000); // Check setiap 30 detik

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
      console.log('✅ Data berhasil di-refresh dan di-cache');
    } catch (error) {
      console.error('❌ Gagal fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter produk berdasarkan search term (CSR manipulation)
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
      {/* Banner Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BannerCarousel />
      </div>

      {/* Products */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Produk Kami
          </h2>
          
          {/* Search Filter (CSR manipulation) */}
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          />
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

// Helper functions untuk localStorage caching


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
