'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    console.error('Error caught by global error boundary:', error);
  }, [error]);

  // 1. Tampilan Khusus Admin
  if (pathname?.startsWith('/admin')) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-600 mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-3">Akses Admin Bermasalah</h1>
            <p className="text-gray-600 mb-2">Terjadi kesalahan pada area admin. Silakan coba lagi atau login ulang.</p>
            {error.message && (
              <p className="text-sm text-gray-500 mt-4 p-3 bg-gray-100 rounded-lg">{error.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <button onClick={reset} className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition">
              Coba Lagi
            </button>
            <Link href="/login" className="block w-full bg-white text-gray-700 border-2 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
              Login Ulang
            </Link>
            <Link href="/" className="block text-sm text-gray-600 hover:text-gray-900 transition">
              atau Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Tampilan Khusus Produk
  if (pathname?.startsWith('/product/')) {
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

  // 3. Tampilan Default (Global)
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500 mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-3">Oops! Terjadi Kesalahan</h1>
          <p className="text-gray-600 mb-2">Maaf, ada yang tidak beres. Silakan coba lagi.</p>
          {error.message && (
            <p className="text-sm text-gray-500 mt-4 p-3 bg-gray-100 rounded-lg">{error.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <button onClick={reset} className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
            Coba Lagi
          </button>
          <Link href="/" className="block w-full bg-white text-gray-700 border-2 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
