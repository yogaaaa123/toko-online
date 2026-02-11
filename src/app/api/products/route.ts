import { NextRequest, NextResponse } from 'next/server';
import { addLocalProduct } from '@/lib/productStore';
import { fetchMergedProducts } from '@/lib/productService';

// GET - List all products
export async function GET() {
  try {
    const allProducts = await fetchMergedProducts();
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data produk' },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, price, description, categoryId, images } = body;

    // Validate required fields
    if (!title || !price || !description) {
      return NextResponse.json(
        { error: 'Title, price, dan description wajib diisi' },
        { status: 400 }
      );
    }

    // Create product via Platzi API
    const response = await fetch('https://api.escuelajs.co/api/v1/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        price: Number(price),
        description,
        categoryId: categoryId || 1,
        images: images || ['https://placehold.co/600x400'],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create product');
    }

    const newProduct = await response.json();
    
    // Also store locally for immediate updates
    addLocalProduct(newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Gagal membuat produk' },
      { status: 500 }
    );
  }
}
