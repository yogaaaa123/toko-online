import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('auth-token');
    const token = tokenCookie?.value;

    if (!token) {
      return NextResponse.json({ isAuthenticated: false, user: null });
    }

    // Verify JWT
    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ isAuthenticated: false, user: null });
    }

    // Return user info from token payload
    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        role: payload.role,
        avatar: payload.avatar,
      },
    });
  } catch (error) {
    console.error('Check auth error:', error);
    return NextResponse.json(
      { isAuthenticated: false, user: null },
      { status: 500 }
    );
  }
}
