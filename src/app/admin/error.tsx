'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin area error:', error);
  }, [error]);

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
