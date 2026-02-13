import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductImageGallery from '@/components/ProductImageGallery';
import ProductActionCard from '@/components/ProductActionCard';
import { Product } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const product = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`).then((res) => {
      if (!res.ok) return null;
      return res.json();
    });

    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The product you are looking for does not exist.',
      };
    }

    const imageUrl = product.images && product.images.length > 0 
        ? product.images[0].replace(/^["']|["']$/g, '') 
        : 'https://placehold.co/600x400';

    return {
      title: product.title,
      description: product.description,
      openGraph: {
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Toko Online',
    };
  }
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Fetch product data
  const res = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`, {
    // cache: 'no-store' // Uncomment this to force fresh data on every request (SSR behavior)
  });

  if (!res.ok) {
    if (res.status === 404 || res.status === 400) {
      notFound();
    }
    throw new Error(`Failed to fetch product: ${res.statusText}`);
  }

  const product: Product = await res.json();

  if (!product) {
      notFound();
  }

  // Deterministic mock data based on product ID
  const productId = product.id;
  const soldCount = (productId * 71) % 4000 + 100;
  const rating = ((productId * 13 % 10) / 10 + 4).toFixed(1);
  const reviewCount = (productId * 29) % 500 + 10;
  const stock = (productId * 17) % 90 + 10;

  return (
    <div className="bg-white min-h-screen pb-12">
      {/* Breadcrumb (simplified) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-green-600">Produk</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.title}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Image Gallery (4 cols) */}
          <div className="lg:col-span-4">
            <ProductImageGallery 
              images={product.images} 
              title={product.title} 
            />
          </div>

          {/* Center Column: Product Info (5 cols) */}
          <div className="lg:col-span-5">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
            
            <div className="flex items-center gap-4 text-sm mb-4">
              <span className="text-gray-600">Terjual <span className="font-medium text-gray-900">{soldCount}+</span></span>
              <div className="flex items-center border border-gray-300 rounded px-2 py-0.5">
                <span className="text-yellow-500 font-bold mr-1">★</span>
                <span className="font-medium text-gray-900">{rating}</span>
                <span className="text-gray-400 mx-1">•</span>
                <span className="text-gray-500">({reviewCount} rating)</span>
              </div>
            </div>

            <div className="text-3xl font-bold text-gray-900 mb-6 font-sans">
              ${product.price}
            </div>

            <div className="border-t border-b border-gray-100 py-4 mb-6">
              <h3 className="font-bold text-green-600 border-b-2 border-green-600 inline-block pb-1 mb-4 cursor-pointer">
                Detail
              </h3>
              
              <div className="space-y-3 text-sm text-gray-700">
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-gray-500">Kondisi</span>
                  <span className="col-span-2 font-medium">Baru</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-gray-500">Berat Satuan</span>
                  <span className="col-span-2 font-medium">500 g</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-gray-500">Kategori</span>
                  <span className="col-span-2 font-medium text-green-600">{product.category.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-gray-500">Etalase</span>
                  <span className="col-span-2 font-medium text-green-600">Semua Etalase</span>
                </div>
              </div>
            </div>

            <div className="prose prose-sm max-w-none text-gray-700">
              <p className="whitespace-pre-line">{product.description}</p>
              <p className="mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
              </p>
            </div>
          </div>

          {/* Right Column: Action Card (3 cols) */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <ProductActionCard 
                product={product} 
                stock={stock}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
