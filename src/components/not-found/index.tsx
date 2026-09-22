import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-8">
          <span className="text-8xl font-bold text-blue-600">404</span>
          <h1 className="text-3xl font-bold mt-6 mb-3">Halaman Tidak Ditemukan</h1>
          <p className="text-gray-600">Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.</p>
        </div>

        <div className="space-y-3">
          <Link href="/" className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
            Kembali ke Beranda
          </Link>
          <Link href="/products" className="block w-full bg-white text-gray-700 border-2 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
            Lihat Produk
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500">Atau gunakan navigasi di atas untuk menemukan apa yang Anda cari.</p>
      </div>
    </div>
  );
}
