import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
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
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Login required' },
        { status: 401 }
      );
    }

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
        categoryId: categoryId || 62,
        images: images || ['https://placehold.co/600x400'],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('External API Error:', errorData);
      throw new Error(`Failed to create product: ${errorData}`);
    }

    const newProduct = await response.json();
    
    // Also store locally for immediate updates
    addLocalProduct(newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    // Extract error message if possible
    const errorMessage = error instanceof Error ? error.message : 'Gagal membuat produk';
    
    // Try to parse if it's a JSON string from the external API
    let parsedError = errorMessage;
    try {
      const jsonError = JSON.parse(errorMessage.replace('Failed to create product: ', ''));
      if (jsonError.message) {
         parsedError = Array.isArray(jsonError.message) ? jsonError.message.join(', ') : jsonError.message;
      }
    } catch {
      // Ignore parsing error
    }

    return NextResponse.json(
      { error: parsedError },
      { status: 500 }
    );
  }
}
