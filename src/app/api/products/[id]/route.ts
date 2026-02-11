import { NextRequest, NextResponse } from 'next/server';
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
    const { id } = await params;
    const body = await request.json();
    const { title, price, description } = body;

    // Optimistically update local store if present
    const localUpdate = updateLocalProduct(Number(id), {
      title,
      price: Number(price),
      description
    });

    if (localUpdate) {
      return NextResponse.json(localUpdate);
    }

    const response = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, price, description }),
    });

    if (!response.ok) {
      throw new Error('Failed to update product');
    }

    const updatedProduct = await response.json();
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate produk' },
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
      // API might return error if product doesn't exist there (was local only)
      // or if it's not allowed to delete. But since we checked local first,
      // let's assume if it fails here it's a real error or non-existent external product.
      throw new Error('Failed to delete product');
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
