import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { removeLocalProduct, updateLocalProduct } from '@/lib/productStore';

// GET - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const response = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`, {
      next: { revalidate: 60 }, // ISR
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Produk tidak ditemukan' },
        { status: 404 }
      );
    }

    const product = await response.json();
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data produk' },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Login required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { title, price, description, categoryId, images } = body;

    // Validate and clean up images
    let cleanImages: string[] = [];
    if (images && Array.isArray(images)) {
      cleanImages = images
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0 && s.startsWith('http'));
    }
    
    // Default image if empty
    if (cleanImages.length === 0) {
      cleanImages = ['https://placehold.co/600x400'];
    }

    const payload = {
      title,
      price: Number(price),
      description,
      categoryId: Number(categoryId),
      images: cleanImages,
    };

    // Optimistically update local store if present
    const localUpdate = updateLocalProduct(Number(id), payload);

    if (localUpdate) {
      return NextResponse.json(localUpdate);
    }

    const response = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
       const errorData = await response.text();
       console.error('External API Update Error:', errorData);
       throw new Error(`Failed to update product: ${errorData}`);
    }

    const updatedProduct = await response.json();
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    
    // Extract error message if possible
    const errorMessage = error instanceof Error ? error.message : 'Gagal mengupdate produk';
    
    // Try to parse if it's a JSON string from the external API
    let parsedError = errorMessage;
    try {
      const jsonError = JSON.parse(errorMessage.replace('Failed to update product: ', ''));
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

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Login required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    // Try to remove from local store first
    const removedLocally = removeLocalProduct(Number(id));
    
    if (removedLocally) {
      return NextResponse.json({ success: true, message: 'Produk berhasil dihapus dari local store' });
    }

    const response = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.text();
       console.error('External API Delete Error:', errorData);
       throw new Error(`Failed to delete product: ${errorData}`);
    }

    return NextResponse.json({ success: true, message: 'Produk berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus produk' },
      { status: 500 }
    );
  }
}
