'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Product page error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-500 mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-3">Produk Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-2">Maaf, produk yang Anda cari tidak tersedia atau telah dihapus.</p>
          {error.message && (
            <p className="text-sm text-gray-500 mt-4 p-3 bg-gray-100 rounded-lg">{error.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <button onClick={reset} className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition">
            Coba Lagi
          </button>
          <Link href="/products" className="block w-full bg-white text-gray-700 border-2 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
            Lihat Semua Produk
          </Link>
          <Link href="/" className="block text-sm text-gray-600 hover:text-gray-900 transition">
            atau Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
